import { NewsSource, Story, RawNewsItem, NewsroomStats, SystemSettings, StoryStatus } from '../types';
import { SEED_SOURCES, SEED_STORIES, INITIAL_SETTINGS, INITIAL_STATS } from '../data/seedData';
import { fetchLiveNigerianNews } from './clientRss';
import { getSafeSourceUrl } from '../utils/sourceUrl';

const STORIES_STORAGE_KEY = 'nigeria_daily_dispatch_stories_v3';
const SOURCES_STORAGE_KEY = 'nigeria_daily_dispatch_sources_v3';
const SETTINGS_STORAGE_KEY = 'nigeria_daily_dispatch_settings_v3';
const STATS_STORAGE_KEY = 'nigeria_daily_dispatch_stats_v3';
const REMOVED_IDS_STORAGE_KEY = 'nigeria_removed_story_ids_v3';

// Helper: load removed IDs
export function getRemovedStoryIds(): Set<string> {
  try {
    const raw = localStorage.getItem(REMOVED_IDS_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

// Helper: record removed ID
export function markStoryAsRemoved(id: string): void {
  try {
    const set = getRemovedStoryIds();
    set.add(id);
    localStorage.setItem(REMOVED_IDS_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

// Helper: unmark removed ID (restore)
export function unmarkStoryAsRemoved(id: string): void {
  try {
    const set = getRemovedStoryIds();
    set.delete(id);
    localStorage.setItem(REMOVED_IDS_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

// Helper: get local stories
function getLocalStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_STORAGE_KEY);
    const removedIds = getRemovedStoryIds();
    
    let list: Story[] = [];
    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = SEED_STORIES;
    }

    // Ensure all story source URLs are safe & valid (no 404s)
    list = list.map(s => ({
      ...s,
      primarySourceUrl: getSafeSourceUrl(s),
      sources: s.sources?.map(src => ({
        ...src,
        sourceUrl: getSafeSourceUrl({ primarySourceUrl: src.sourceUrl, primarySourceName: src.sourceName })
      })) || s.sources
    }));

    // Filter out removed / rejected
    return list.filter(s => !removedIds.has(s.id));
  } catch {
    return SEED_STORIES.filter(s => !getRemovedStoryIds().has(s.id));
  }
}

// Helper: save local stories
function saveLocalStories(stories: Story[]): void {
  try {
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
  } catch {}
}

export const api = {
  // Sources
  async getSources(): Promise<NewsSource[]> {
    try {
      const res = await fetch('/api/sources');
      if (res.ok) {
        const data = await res.json();
        if (data.sources && Array.isArray(data.sources)) {
          localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(data.sources));
          return data.sources;
        }
      }
    } catch {}

    // Fallback
    try {
      const raw = localStorage.getItem(SOURCES_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return SEED_SOURCES;
  },

  async addSource(sourceData: Partial<NewsSource>): Promise<NewsSource> {
    const newSource: NewsSource = {
      id: `src-${Date.now()}`,
      name: sourceData.name || 'Custom Source',
      type: sourceData.type || 'rss',
      rssUrl: sourceData.rssUrl || '',
      websiteUrl: sourceData.websiteUrl || '',
      category: sourceData.category || 'General',
      priority: sourceData.priority || 'medium',
      trustScore: sourceData.trustScore || 90,
      active: sourceData.active ?? true,
      lastCheckedAt: new Date().toISOString(),
      logoUrl: sourceData.logoUrl,
      description: sourceData.description,
      isTopFive: false,
      totalArticlesCount: 0
    };

    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sourceData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.source) return data.source;
      }
    } catch {}

    const sources = await this.getSources();
    sources.unshift(newSource);
    localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(sources));
    return newSource;
  },

  async updateSource(id: string, updates: Partial<NewsSource>): Promise<NewsSource> {
    try {
      const res = await fetch(`/api/sources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.source) return data.source;
      }
    } catch {}

    const sources = await this.getSources();
    const idx = sources.findIndex(s => s.id === id);
    if (idx !== -1) {
      sources[idx] = { ...sources[idx], ...updates };
      localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(sources));
      return sources[idx];
    }
    throw new Error('Source not found');
  },

  async deleteSource(id: string): Promise<boolean> {
    try {
      await fetch(`/api/sources/${id}`, { method: 'DELETE' });
    } catch {}

    const sources = await this.getSources();
    const filtered = sources.filter(s => s.id !== id);
    localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  async syncSource(id: string): Promise<any> {
    try {
      const res = await fetch(`/api/sources/${id}/sync`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {}

    // Client-side fallback
    const liveStories = await fetchLiveNigerianNews();
    if (liveStories.length > 0) {
      const current = getLocalStories();
      const removedIds = getRemovedStoryIds();
      const newStories = liveStories.filter(s => !removedIds.has(s.id) && !current.some(c => c.id === s.id || c.headline === s.headline));
      const combined = [...newStories, ...current];
      saveLocalStories(combined);
      return { success: true, count: newStories.length };
    }
    return { success: true, count: 0 };
  },

  async syncAllSources(): Promise<any> {
    let serverSynced = false;
    try {
      const res = await fetch('/api/sources/sync-all', { method: 'POST' });
      if (res.ok) {
        serverSynced = true;
      }
    } catch {}

    // In all environments (Node, Vercel, another browser, mobile device), ALWAYS run direct client RSS sync
    // to capture Technology, Sports, Education, Business, Entertainment, and Politics instantly
    const liveStories = await fetchLiveNigerianNews();
    const current = getLocalStories();
    const removedIds = getRemovedStoryIds();
    
    const newStories = liveStories.filter(s => 
      !removedIds.has(s.id) && 
      !current.some(c => c.id === s.id || c.headline.toLowerCase().trim() === s.headline.toLowerCase().trim())
    );

    let merged = [...newStories, ...current];
    saveLocalStories(merged);

    // If server was synced, also fetch latest server list and merge
    if (serverSynced) {
      try {
        const res = await fetch('/api/stories');
        if (res.ok) {
          const data = await res.json();
          if (data.stories && Array.isArray(data.stories)) {
            const serverStories: Story[] = data.stories;
            const existingIds = new Set(merged.map(s => s.id));
            const serverOnly = serverStories.filter(s => !existingIds.has(s.id) && !removedIds.has(s.id));
            merged = [...merged, ...serverOnly];
            saveLocalStories(merged);
            return { success: true, newArticles: newStories.length + serverOnly.length, totalArticles: merged.length };
          }
        }
      } catch {}
    }

    return { success: true, newArticles: newStories.length, totalArticles: merged.length };
  },

  // Stories
  async getStories(params?: { status?: string; category?: string; sourceId?: string; search?: string }): Promise<Story[]> {
    const removedIds = getRemovedStoryIds();
    let resultList: Story[] = [];

    try {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.category) query.append('category', params.category);
      if (params?.sourceId) query.append('sourceId', params.sourceId);
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`/api/stories?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.stories && Array.isArray(data.stories) && data.stories.length > 0) {
          resultList = data.stories;
          // Merge with local stories to ensure no lost client updates
          const localList = getLocalStories();
          const serverIds = new Set(resultList.map(s => s.id));
          const clientOnly = localList.filter(s => !serverIds.has(s.id) && !removedIds.has(s.id));
          resultList = [...resultList, ...clientOnly];
        }
      }
    } catch {}

    if (resultList.length === 0) {
      resultList = getLocalStories();
    }

    // Apply safe URLs so clicking source links NEVER 404s
    resultList = resultList.map(s => ({
      ...s,
      primarySourceUrl: getSafeSourceUrl(s),
      sources: s.sources?.map(src => ({
        ...src,
        sourceUrl: getSafeSourceUrl({ primarySourceUrl: src.sourceUrl, primarySourceName: src.sourceName })
      })) || s.sources
    }));

    // Filter out removed / rejected items
    resultList = resultList.filter(s => !removedIds.has(s.id));

    // Filter parameters
    if (params?.status && params.status !== 'all') {
      resultList = resultList.filter(s => s.status === params.status);
    }
    if (params?.category && params.category !== 'All') {
      resultList = resultList.filter(s => s.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.sourceId) {
      resultList = resultList.filter(s => s.sources.some(src => src.sourceId === params.sourceId));
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      resultList = resultList.filter(s => 
        s.headline.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    // Cache updated list locally
    if (resultList.length > 0) {
      saveLocalStories(resultList);
    }

    return resultList;
  },

  async getStory(id: string): Promise<Story> {
    try {
      const res = await fetch(`/api/stories/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.story) return { ...data.story, primarySourceUrl: getSafeSourceUrl(data.story) };
      }
    } catch {}

    const local = getLocalStories().find(s => s.id === id);
    if (local) return { ...local, primarySourceUrl: getSafeSourceUrl(local) };
    throw new Error('Story not found');
  },

  async createStory(storyData: Partial<Story>): Promise<Story> {
    const newStory: Story = {
      id: `story-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      clusterId: `cluster_${Date.now()}`,
      headline: storyData.headline || 'Editorial Dispatch',
      summary: storyData.summary || '',
      article: storyData.article || '',
      whatHappened: storyData.whatHappened || '',
      mainStory: storyData.mainStory || storyData.article || '',
      background: storyData.background || '',
      whatHappensNext: storyData.whatHappensNext || '',
      keyPoints: storyData.keyPoints || [],
      category: storyData.category || 'General',
      tags: storyData.tags || ['Nigeria', 'News'],
      slug: storyData.slug || `story-${Date.now()}`,
      image: storyData.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
      imageCaption: storyData.imageCaption || '',
      imageCredit: storyData.imageCredit || 'Editorial Desk',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confidenceScore: storyData.confidenceScore || 95,
      status: storyData.status || 'published',
      isBreaking: storyData.isBreaking ?? false,
      isTrending: storyData.isTrending ?? false,
      views: 1,
      shares: 0,
      readingTimeMinutes: storyData.readingTimeMinutes || 3,
      requiresReview: storyData.requiresReview ?? false,
      reviewReason: storyData.reviewReason,
      primarySourceName: storyData.primarySourceName || 'Editorial Staff',
      primarySourceUrl: getSafeSourceUrl(storyData),
      sources: storyData.sources || [],
      seoTitle: storyData.seoTitle || `${storyData.headline} | Nigerian AI News Hub`,
      metaDescription: storyData.metaDescription || storyData.summary?.slice(0, 155),
      canonicalUrl: storyData.canonicalUrl || `https://nigerianainewshub.ng/news/general/${storyData.slug || 'story'}`,
      aiModelUsed: storyData.aiModelUsed || 'editorial-manual',
      aiProcessingTimeMs: 50
    };

    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.story) {
          const list = getLocalStories();
          list.unshift(data.story);
          saveLocalStories(list);
          return data.story;
        }
      }
    } catch {}

    const list = getLocalStories();
    list.unshift(newStory);
    saveLocalStories(list);
    return newStory;
  },

  async updateStory(id: string, updates: Partial<Story>): Promise<Story> {
    // If status is set to rejected, mark as removed permanently
    if (updates.status === 'rejected') {
      markStoryAsRemoved(id);
    }

    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.story) {
          // Update local cache as well
          const list = getLocalStories();
          const idx = list.findIndex(s => s.id === id);
          if (idx !== -1) {
            list[idx] = { ...list[idx], ...data.story };
            saveLocalStories(list);
          }
          return data.story;
        }
      }
    } catch {}

    // Client persistence fallback
    const list = getLocalStories();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
      saveLocalStories(list);
      return list[idx];
    }

    throw new Error('Story not found to update');
  },

  async updateStoryStatus(id: string, status: StoryStatus, reviewReason?: string): Promise<Story> {
    if (status === 'rejected') {
      markStoryAsRemoved(id);
    } else {
      unmarkStoryAsRemoved(id);
    }
    return this.updateStory(id, { status, requiresReview: false, reviewReason });
  },

  async deleteStory(id: string): Promise<boolean> {
    // Permanently mark as removed
    markStoryAsRemoved(id);

    try {
      await fetch(`/api/stories/${id}`, { method: 'DELETE' });
    } catch {}

    const list = getLocalStories();
    const filtered = list.filter(s => s.id !== id);
    saveLocalStories(filtered);
    return true;
  },

  // Queue
  async getRawNewsItems(): Promise<RawNewsItem[]> {
    try {
      const res = await fetch('/api/queue');
      if (res.ok) {
        const data = await res.json();
        return data.items || [];
      }
    } catch {}
    return [];
  },

  async getRawQueue(): Promise<RawNewsItem[]> {
    return this.getRawNewsItems();
  },

  async incrementStoryViews(id: string): Promise<void> {
    try {
      await fetch(`/api/stories/${id}/view`, { method: 'POST' });
    } catch {}
    const list = getLocalStories();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx].views = (list[idx].views || 0) + 1;
      saveLocalStories(list);
    }
  },

  async processRawItem(id: string): Promise<any> {
    try {
      const res = await fetch(`/api/queue/process/${id}`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true };
  },

  async triggerLiveDemoSynthesis(): Promise<any> {
    try {
      const res = await fetch('/api/queue/process-demo', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true };
  },

  // Stats & Settings
  async getStats(): Promise<NewsroomStats> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(data.stats));
          return data.stats;
        }
      }
    } catch {}

    try {
      const raw = localStorage.getItem(STATS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_STATS;
  },

  async getSettings(): Promise<SystemSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data.settings));
          return data.settings;
        }
      }
    } catch {}

    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_SETTINGS;
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data.settings));
          return data.settings;
        }
      }
    } catch {}

    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async getBreakingNews(): Promise<Story[]> {
    const stories = await this.getStories({ status: 'published' });
    return stories.filter(s => s.isBreaking);
  },

  async getTrendingNews(): Promise<Story[]> {
    const stories = await this.getStories({ status: 'published' });
    return stories.filter(s => s.isTrending);
  },

  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true, message: `Thank you for subscribing ${email}! You will receive the daily Nigerian AI briefing.` };
  },

  // Groq AI Chat Box
  async askGroqChat(query: string, history: Array<{ role: 'user' | 'assistant'; content: string }> = [], model = 'llama-3.3-70b-versatile'): Promise<{ reply: string; model: string; sources: Array<{ title: string; source: string; url: string }> }> {
    try {
      const res = await fetch('/api/chat/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history, model })
      });
      if (res.ok) return await res.json();
    } catch {}

    // Intelligent local fallback response
    const published = getLocalStories().filter(s => s.status === 'published');
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const relevant = published.filter(s => {
      const text = (s.headline + ' ' + s.summary + ' ' + s.category).toLowerCase();
      return queryWords.some(w => text.includes(w));
    }).slice(0, 3);

    let reply = `Based on the latest reports from Nigeria's top press desks:\n\n`;
    if (relevant.length > 0) {
      reply += relevant.map(s => `• **${s.headline}** (${s.primarySourceName}):\n  ${s.summary}`).join('\n\n');
    } else {
      reply += `Nigeria's top news channels (The Punch, Channels TV, Premium Times, Vanguard, Daily Post) are actively monitored for key developments in politics, business, security, sports, and technology.`;
    }

    return {
      reply,
      model: 'The Intelligence Brief Engine (Verified Local Wire)',
      sources: relevant.map(s => ({
        title: s.headline,
        source: s.primarySourceName,
        url: s.primarySourceUrl
      }))
    };
  }
};
