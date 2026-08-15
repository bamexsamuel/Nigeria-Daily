import { NewsSource, Story, RawNewsItem, NewsroomStats, SystemSettings } from '../types';

export const api = {
  // Sources
  async getSources(): Promise<NewsSource[]> {
    const res = await fetch('/api/sources');
    const data = await res.json();
    return data.sources || [];
  },

  async addSource(sourceData: Partial<NewsSource>): Promise<NewsSource> {
    const res = await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sourceData)
    });
    const data = await res.json();
    return data.source;
  },

  async updateSource(id: string, updates: Partial<NewsSource>): Promise<NewsSource> {
    const res = await fetch(`/api/sources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data.source;
  },

  async deleteSource(id: string): Promise<boolean> {
    const res = await fetch(`/api/sources/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  async syncSource(id: string): Promise<any> {
    const res = await fetch(`/api/sources/${id}/sync`, { method: 'POST' });
    return res.json();
  },

  async syncAllSources(): Promise<any> {
    const res = await fetch('/api/sources/sync-all', { method: 'POST' });
    return res.json();
  },

  // Stories
  async getStories(params?: { status?: string; category?: string; sourceId?: string; search?: string }): Promise<Story[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.sourceId) query.append('sourceId', params.sourceId);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/stories?${query.toString()}`);
    const data = await res.json();
    return data.stories || [];
  },

  async getStory(id: string): Promise<Story> {
    const res = await fetch(`/api/stories/${id}`);
    const data = await res.json();
    return data.story;
  },

  async incrementStoryViews(id: string): Promise<void> {
    await fetch(`/api/stories/${id}/view`, { method: 'POST' }).catch(() => {});
  },

  async updateStoryStatus(id: string, status: string): Promise<Story> {
    const res = await fetch(`/api/stories/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    return data.story;
  },

  async updateStory(id: string, updates: Partial<Story>): Promise<Story> {
    const res = await fetch(`/api/stories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return data.story;
  },

  async deleteStory(id: string): Promise<boolean> {
    const res = await fetch(`/api/stories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return data.success;
  },

  // Queue & Pipeline
  async getRawQueue(): Promise<RawNewsItem[]> {
    const res = await fetch('/api/queue/raw');
    const data = await res.json();
    return data.items || [];
  },

  async processRawItem(id: string): Promise<any> {
    const res = await fetch(`/api/queue/process/${id}`, { method: 'POST' });
    return res.json();
  },

  async triggerLiveDemoSynthesis(): Promise<any> {
    const res = await fetch('/api/queue/process-demo', { method: 'POST' });
    return res.json();
  },

  // Stats & Settings
  async getStats(): Promise<NewsroomStats> {
    const res = await fetch('/api/stats');
    const data = await res.json();
    return data.stats;
  },

  async getSettings(): Promise<SystemSettings> {
    const res = await fetch('/api/settings');
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    return data.settings;
  },

  async getBreakingNews(): Promise<Story[]> {
    const res = await fetch('/api/news/breaking');
    const data = await res.json();
    return data.breaking || [];
  },

  async getTrendingNews(): Promise<Story[]> {
    const res = await fetch('/api/news/trending');
    const data = await res.json();
    return data.trending || [];
  },

  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  // Groq AI Chat Box
  async askGroqChat(query: string, history: Array<{ role: 'user' | 'assistant'; content: string }> = [], model = 'llama-3.3-70b-versatile'): Promise<{ reply: string; model: string; sources: Array<{ title: string; source: string; url: string }> }> {
    const res = await fetch('/api/chat/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, history, model })
    });
    return res.json();
  }
};

