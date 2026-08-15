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

function extractImageFromItem(item: any): string | undefined {
  // Check enclosure
  if (item.enclosure && item.enclosure['@_url']) {
    return item.enclosure['@_url'];
  }
  // Check media:content
  if (item['media:content'] && item['media:content']['@_url']) {
    return item['media:content']['@_url'];
  }
  if (item['media:thumbnail'] && item['media:thumbnail']['@_url']) {
    return item['media:thumbnail']['@_url'];
  }
  // Check in description
  const desc = item.description || item['content:encoded'] || '';
  const imgMatch = desc.match(/<img[^>]+src="([^">]+)"/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  return undefined;
}

export async function fetchFeedForSource(source: NewsSource): Promise<{
  sourceId: string;
  sourceName: string;
  itemsFound: number;
  newItemsAdded: number;
  duplicatesSkipped: number;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(source.rssUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'NigerianAINewsHub/1.0 (News Aggregator & AI Synthesizer; Contact: newsroom@nigerianainewshub.ng)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parsed = parser.parse(xmlText);

    const channel = parsed?.rss?.channel || parsed?.feed;
    if (!channel) {
      throw new Error('Invalid RSS/Atom format or missing channel element');
    }

    const rawItems = Array.isArray(channel.item)
      ? channel.item
      : channel.item
      ? [channel.item]
      : Array.isArray(channel.entry)
      ? channel.entry
      : channel.entry
      ? [channel.entry]
      : [];

    let newItemsAdded = 0;
    let duplicatesSkipped = 0;

    for (const item of rawItems) {
      const title = cleanHtml(item.title || '');
      const link = item.link?.['@_href'] || item.link || item.guid?.['#text'] || item.guid || '';
      const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString();
      const content = cleanHtml(item['content:encoded'] || item.description || item.summary || '');
      const imageUrl = extractImageFromItem(item);

      if (!title || !link) continue;

      const hash = calculateHash(title + link);
      const isDupe = db.isDuplicateContent(hash, link, title);

      if (isDupe) {
        duplicatesSkipped++;
        db.incrementDuplicateBlocked();
        continue;
      }

      const rawNewsItem: RawNewsItem = {
        id: `raw-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: String(link).trim(),
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

    // Update source lastChecked timestamp
    db.updateSource(source.id, {
      lastCheckedAt: new Date().toISOString()
    });

    return {
      sourceId: source.id,
      sourceName: source.name,
      itemsFound: rawItems.length,
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
