export type SourceType = 'rss' | 'api' | 'youtube';
export type StoryStatus = 'published' | 'review' | 'draft' | 'rejected' | 'scheduled';
export type NewsCategory = 
  | 'Politics' 
  | 'Business' 
  | 'Technology' 
  | 'Entertainment' 
  | 'Sports' 
  | 'Crime & Security' 
  | 'Education' 
  | 'Health' 
  | 'World' 
  | 'General';

export interface NewsSource {
  id: string;
  name: string;
  type: SourceType;
  rssUrl: string;
  apiUrl?: string;
  youtubeChannelId?: string;
  category: NewsCategory;
  priority: 'high' | 'medium' | 'low';
  trustScore: number; // 0 - 100
  active: boolean;
  lastCheckedAt?: string;
  websiteUrl: string;
  logoUrl?: string;
  description: string;
  isTopFive: boolean;
  totalArticlesCount: number;
}

export interface RawNewsItem {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  sourceTitle: string;
  sourcePublishedAt: string;
  discoveredAt: string;
  content: string;
  summary?: string;
  author?: string;
  contentHash: string;
  category?: string;
  imageUrl?: string;
  status: 'pending' | 'processing' | 'processed' | 'duplicate' | 'failed';
  errorMessage?: string;
}

export interface StorySource {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  relationship: 'primary' | 'secondary' | 'official_statement' | 'video_report';
}

export interface Story {
  id: string;
  clusterId: string;
  headline: string;
  summary: string;
  article: string;
  whatHappened: string;
  mainStory: string;
  background: string;
  whatHappensNext?: string;
  keyPoints: string[];
  category: NewsCategory;
  tags: string[];
  slug: string;
  image: string;
  imageCaption?: string;
  imageCredit?: string;
  publishedAt: string;
  updatedAt: string;
  confidenceScore: number; // 0 - 100
  status: StoryStatus;
  isBreaking: boolean;
  isTrending?: boolean;
  views: number;
  shares: number;
  readingTimeMinutes: number;
  requiresReview: boolean;
  reviewReason?: string;
  
  // Attribution & Integrity
  primarySourceName: string;
  primarySourceUrl: string;
  sources: StorySource[];
  
  // SEO
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  
  // AI Metadata
  aiModelUsed: string;
  aiProcessingTimeMs?: number;
}

export interface ProcessingJob {
  id: string;
  newsItemId: string;
  sourceName: string;
  headline: string;
  stage: 'fetch' | 'dedup' | 'clustering' | 'ai_writing' | 'quality_check' | 'published';
  status: 'queued' | 'running' | 'completed' | 'failed';
  error?: string;
  startedAt: string;
  completedAt?: string;
  confidenceScore?: number;
  resultStoryId?: string;
}

export interface NewsroomStats {
  todayArticlesCount: number;
  pendingReviewCount: number;
  sourcesOnlineCount: number;
  totalSourcesCount: number;
  articlesPublishedCount: number;
  articlesFailedCount: number;
  duplicateBlockedCount: number;
  estimatedTokensUsed: number;
  aiCostEstimateUsd: number;
  topCategories: { category: string; count: number }[];
  recentJobs: ProcessingJob[];
}

export interface SystemSettings {
  websiteName: string;
  siteDescription: string;
  geminiModel: string;
  autoPublishEnabled: boolean;
  minConfidenceThreshold: number;
  sensitiveReviewThreshold: number;
  pollingFrequencyMinutes: number;
  watTimezone: string;
  editorialStyle: string;
}
