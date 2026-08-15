import { XMLParser } from 'fast-xml-parser';
import crypto from 'crypto';
import { NewsSource, RawNewsItem } from '../src/types';
import { db } from './db';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: true
});

function calculateHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function cleanHtml(htmlText?: string): string {
  if (!htmlText) return '';
  return htmlText
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImageFromItem(item: any, rawXmlSnippet?: string): string | undefined {
  // 1. Check enclosure (object or array)
  if (item.enclosure) {
    if (Array.isArray(item.enclosure)) {
      const enc = item.enclosure.find((e: any) => e['@_url'] || e.url);
      if (enc && (enc['@_url'] || enc.url)) return String(enc['@_url'] || enc.url).trim();
    } else if (item.enclosure['@_url'] || item.enclosure.url) {
      return String(item.enclosure['@_url'] || item.enclosure.url).trim();
    }
  }

  // 2. Check media:content (object or array)
  const mediaContent = item['media:content'] || item['media:thumbnail'] || item['media:group'];
  if (mediaContent) {
    if (Array.isArray(mediaContent)) {
      const med = mediaContent.find((m: any) => m['@_url'] || m.url || (m['media:content'] && m['media:content']['@_url']));
      if (med) {
        const url = med['@_url'] || med.url || med['media:content']?.['@_url'];
        if (url) return String(url).trim();
      }
    } else {
      const url = mediaContent['@_url'] || mediaContent.url || mediaContent['media:content']?.['@_url'] || mediaContent['media:thumbnail']?.['@_url'];
      if (url) return String(url).trim();
    }
  }

  // 3. Check HTML content and description for <img> tags
  const rawHtml = String(item['content:encoded'] || item.description || item.summary || item['content'] || '');
  const imgMatch = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    const src = imgMatch[1].trim();
    if (src.startsWith('http') && !src.includes('avatar') && !src.includes('icon')) {
      return src;
    }
  }

  // 4. Check for direct image URLs inside CDATA or description
  const urlMatch = rawHtml.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|avif)/i);
  if (urlMatch && urlMatch[0]) {
    return urlMatch[0];
  }

  // 5. Fallback check on raw XML snippet if passed
  if (rawXmlSnippet) {
    const rawMatch = rawXmlSnippet.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/i);
    if (rawMatch && rawMatch[0]) {
      return rawMatch[0];
    }
  }

  return undefined;
}

// Fast fetch of og:image tag directly from news article URL if RSS didn't include image
async function fetchOgImageFromUrl(articleUrl: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const resp = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeout);
    if (!resp.ok) return undefined;

    const html = await resp.text();
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch && ogMatch[1]) {
      return ogMatch[1].trim();
    }
  } catch {
    // Gracefully ignore network timeout on og:image fetch
  }
  return undefined;
}

// Feeds per source (primary and politics/national category feeds)
const SOURCE_FEED_URLS: Record<string, string[]> = {
  'src-punch-ng': [
    'https://punchng.com/topics/politics/feed/',
    'https://punchng.com/topics/news/feed/',
    'https://punchng.com/feed/'
  ],
  'src-channels-tv': [
    'https://www.channelstv.com/category/politics/feed/',
    'https://www.channelstv.com/feed/'
  ],
  'src-premium-times': [
    'https://www.premiumtimesng.com/category/news/top-news/feed',
    'https://www.premiumtimesng.com/category/news/feed',
    'https://www.premiumtimesng.com/feed'
  ],
  'src-vanguard-ngr': [
    'https://www.vanguardngr.com/category/politics/feed/',
    'https://www.vanguardngr.com/category/national-news/feed/',
    'https://www.vanguardngr.com/feed/'
  ],
  'src-guardian-ng': [
    'https://guardian.ng/category/politics/feed/',
    'https://guardian.ng/category/news/feed/',
    'https://guardian.ng/feed/'
  ]
};

export async function fetchFeedForSource(source: NewsSource): Promise<{
  sourceId: string;
  sourceName: string;
  itemsFound: number;
  newItemsAdded: number;
  duplicatesSkipped: number;
  error?: string;
}> {
  try {
    const feedUrls = SOURCE_FEED_URLS[source.id] || [source.rssUrl];
    let totalItemsFound = 0;
    let newItemsAdded = 0;
    let duplicatesSkipped = 0;

    for (const url of feedUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 NigerianAINewsHub/1.0',
            'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*'
          }
        });
        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const xmlText = await response.text();
        const parsed = parser.parse(xmlText);

        const channel = parsed?.rss?.channel || parsed?.feed;
        if (!channel) continue;

        const rawItems = Array.isArray(channel.item)
          ? channel.item
          : channel.item
          ? [channel.item]
          : Array.isArray(channel.entry)
          ? channel.entry
          : channel.entry
          ? [channel.entry]
          : [];

        totalItemsFound += rawItems.length;

        for (const item of rawItems) {
          const title = cleanHtml(item.title || '');
          const link = String(item.link?.['@_href'] || item.link || item.guid?.['#text'] || item.guid || '').trim();
          const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString();
          const content = cleanHtml(item['content:encoded'] || item.description || item.summary || '');
          let imageUrl = extractImageFromItem(item);

          if (!title || !link) continue;

          const hash = calculateHash(title + link);
          const isDupe = db.isDuplicateContent(hash, link, title);

          if (isDupe) {
            duplicatesSkipped++;
            db.incrementDuplicateBlocked();
            continue;
          }

          // If no image in RSS feed, try fast og:image scrape from the news page
          if (!imageUrl && link.startsWith('http')) {
            imageUrl = await fetchOgImageFromUrl(link);
          }

          const rawNewsItem: RawNewsItem = {
            id: `raw-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            sourceId: source.id,
            sourceName: source.name,
            sourceUrl: link,
            sourceTitle: title,
            sourcePublishedAt: new Date(pubDate).toISOString(),
            discoveredAt: new Date().toISOString(),
            content: content.slice(0, 4000),
            summary: content.slice(0, 300),
            contentHash: hash,
            imageUrl: imageUrl,
            status: 'pending'
          };

          db.addRawNewsItem(rawNewsItem);
          newItemsAdded++;
        }
      } catch (err: any) {
        console.warn(`Feed sync failed for sub-URL ${url}:`, err.message);
      }
    }

    // Update source lastChecked timestamp
    db.updateSource(source.id, {
      lastCheckedAt: new Date().toISOString()
    });

    return {
      sourceId: source.id,
      sourceName: source.name,
      itemsFound: totalItemsFound,
      newItemsAdded,
      duplicatesSkipped
    };
  } catch (err: any) {
    console.error(`Error fetching RSS feed for ${source.name}:`, err.message);
    return {
      sourceId: source.id,
      sourceName: source.name,
      itemsFound: 0,
      newItemsAdded: 0,
      duplicatesSkipped: 0,
      error: err.message
    };
  }
}

export async function fetchAllActiveSources(): Promise<any[]> {
  const sources = db.getAllSources().filter(s => s.active);
  const results = [];

  for (const src of sources) {
    const res = await fetchFeedForSource(src);
    results.push(res);
  }

  return results;
}
