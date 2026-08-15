import { NewsSource, RawNewsItem, Story, ProcessingJob, SystemSettings, NewsroomStats } from '../src/types';
import { TOP_FIVE_NIGERIAN_SOURCES, SEED_STORIES, INITIAL_SETTINGS } from '../src/data/seedData';

class NewsDatabase {
  private sources: Map<string, NewsSource> = new Map();
  private rawNewsItems: Map<string, RawNewsItem> = new Map();
  private stories: Map<string, Story> = new Map();
  private processingJobs: ProcessingJob[] = [];
  private settings: SystemSettings = { ...INITIAL_SETTINGS };
  private duplicateBlockedCount: number = 24;
  private estimatedTokensUsed: number = 184500;
  private aiCostEstimateUsd: number = 0.28;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Load top 5 default sources
    TOP_FIVE_NIGERIAN_SOURCES.forEach(source => {
      this.sources.set(source.id, { ...source });
    });

    // Load initial seed stories
    SEED_STORIES.forEach(story => {
      this.stories.set(story.id, { ...story });
    });

    // Populate initial realistic processing jobs
    this.processingJobs = [
      {
        id: 'job-101',
        newsItemId: 'item-raw-1',
        sourceName: 'Channels Television',
        headline: 'CBN Unveils Enhanced FX Liquidity Framework to Stabilize Naira',
        stage: 'published',
        status: 'completed',
        startedAt: new Date(Date.now() - 26 * 60000).toISOString(),
        completedAt: new Date(Date.now() - 25 * 60000).toISOString(),
        confidenceScore: 97,
        resultStoryId: 'story-cbn-fx-reforms-2026'
      },
      {
        id: 'job-102',
        newsItemId: 'item-raw-2',
        sourceName: 'Premium Times',
        headline: 'FEC Approves ₦1.8 Trillion Infrastructure Package for Eastern Rail',
        stage: 'published',
        status: 'completed',
        startedAt: new Date(Date.now() - 66 * 60000).toISOString(),
        completedAt: new Date(Date.now() - 65 * 60000).toISOString(),
        confidenceScore: 98,
        resultStoryId: 'story-fec-infrastructure-rail-2026'
      },
      {
        id: 'job-103',
        newsItemId: 'item-raw-3',
        sourceName: 'The Guardian Nigeria',
        headline: 'Nigerian Tech Ecosystem Secures $250M for Tier-IV AI Data Center',
        stage: 'published',
        status: 'completed',
        startedAt: new Date(Date.now() - 112 * 60000).toISOString(),
        completedAt: new Date(Date.now() - 110 * 60000).toISOString(),
        confidenceScore: 96,
        resultStoryId: 'story-tech-lagos-ai-data-center-2026'
      }
    ];
  }

  // Sources
  public getAllSources(): NewsSource[] {
    return Array.from(this.sources.values());
  }

  public getSourceById(id: string): NewsSource | undefined {
    return this.sources.get(id);
  }

  public addSource(source: NewsSource): NewsSource {
    this.sources.set(source.id, source);
    return source;
  }

  public updateSource(id: string, updates: Partial<NewsSource>): NewsSource | null {
    const existing = this.sources.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.sources.set(id, updated);
    return updated;
  }

  public deleteSource(id: string): boolean {
    return this.sources.delete(id);
  }

  // Raw News Items & Deduplication
  public getRawNewsItems(): RawNewsItem[] {
    return Array.from(this.rawNewsItems.values()).sort(
      (a, b) => new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime()
    );
  }

  public isDuplicateContent(hash: string, url: string, title: string): boolean {
    for (const item of this.rawNewsItems.values()) {
      if (item.contentHash === hash || item.sourceUrl === url) {
        return true;
      }
      // Simple normalized title similarity check
      const normA = title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normB = item.sourceTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normA && normB && (normA.includes(normB) || normB.includes(normA)) && normA.length > 20) {
        return true;
      }
    }
    return false;
  }

  public addRawNewsItem(item: RawNewsItem): RawNewsItem {
    this.rawNewsItems.set(item.id, item);
    return item;
  }

  public incrementDuplicateBlocked() {
    this.duplicateBlockedCount += 1;
  }

  // Stories
  public getAllStories(options?: { status?: string; category?: string; sourceId?: string; search?: string }): Story[] {
    let list = Array.from(this.stories.values());

    if (options?.status) {
      list = list.filter(s => s.status === options.status);
    }
    if (options?.category && options.category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.sourceId) {
      list = list.filter(s => s.sources.some(src => src.sourceId === options.sourceId) || s.primarySourceName.toLowerCase().includes(options.sourceId.toLowerCase()));
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(s => 
        s.headline.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.primarySourceName.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  public getStoryById(id: string): Story | undefined {
    return this.stories.get(id);
  }

  public getStoryBySlug(slug: string): Story | undefined {
    for (const story of this.stories.values()) {
      if (story.slug === slug) return story;
    }
    return undefined;
  }

  public saveStory(story: Story): Story {
    this.stories.set(story.id, story);
    return story;
  }

  public updateStory(id: string, updates: Partial<Story>): Story | null {
    const existing = this.stories.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.stories.set(id, updated);
    return updated;
  }

  public deleteStory(id: string): boolean {
    return this.stories.delete(id);
  }

  public incrementStoryViews(id: string): void {
    const story = this.stories.get(id);
    if (story) {
      story.views = (story.views || 0) + 1;
      this.stories.set(id, story);
    }
  }

  // Processing Jobs
  public getProcessingJobs(): ProcessingJob[] {
    return [...this.processingJobs].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  public addProcessingJob(job: ProcessingJob): ProcessingJob {
    this.processingJobs.unshift(job);
    if (this.processingJobs.length > 100) {
      this.processingJobs = this.processingJobs.slice(0, 100);
    }
    return job;
  }

  public updateProcessingJob(id: string, updates: Partial<ProcessingJob>): void {
    const idx = this.processingJobs.findIndex(j => j.id === id);
    if (idx !== -1) {
      this.processingJobs[idx] = { ...this.processingJobs[idx], ...updates };
    }
  }

  // Token & AI Tracking
  public trackAiUsage(tokens: number, estimatedCostUsd: number) {
    this.estimatedTokensUsed += tokens;
    this.aiCostEstimateUsd += estimatedCostUsd;
  }

  // Settings
  public getSettings(): SystemSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<SystemSettings>): SystemSettings {
    this.settings = { ...this.settings, ...updates };
    return { ...this.settings };
  }

  // Newsroom Stats
  public getStats(): NewsroomStats {
    const storiesArray = Array.from(this.stories.values());
    const publishedCount = storiesArray.filter(s => s.status === 'published').length;
    const pendingReviewCount = storiesArray.filter(s => s.status === 'review' || s.requiresReview).length;
    const sourcesList = Array.from(this.sources.values());
    const activeSourcesCount = sourcesList.filter(s => s.active).length;

    // Categories breakdown
    const categoryMap: { [cat: string]: number } = {};
    storiesArray.forEach(s => {
      categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count
    })).sort((a, b) => b.count - a.count);

    return {
      todayArticlesCount: publishedCount,
      pendingReviewCount,
      sourcesOnlineCount: activeSourcesCount,
      totalSourcesCount: sourcesList.length,
      articlesPublishedCount: publishedCount,
      articlesFailedCount: this.processingJobs.filter(j => j.status === 'failed').length,
      duplicateBlockedCount: this.duplicateBlockedCount,
      estimatedTokensUsed: this.estimatedTokensUsed,
      aiCostEstimateUsd: Number(this.aiCostEstimateUsd.toFixed(3)),
      topCategories,
      recentJobs: this.processingJobs.slice(0, 10)
    };
  }
}

export const db = new NewsDatabase();
