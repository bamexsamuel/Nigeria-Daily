import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Story, NewsSource } from '../types';

let supabaseClient: SupabaseClient | null = null;

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';


export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  if (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http')) {
    try {
      supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
}

export async function fetchStoriesFromSupabase(): Promise<Story[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('stories')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!data) return null;

    // Map database snake_case columns back to camelCase
    return data.map((row: any) => ({
      id: row.id,
      clusterId: row.cluster_id || `cluster_${row.id}`,
      headline: row.headline,
      summary: row.summary,
      article: row.article || '',
      whatHappened: row.what_happened,
      mainStory: row.main_story,
      background: row.background,
      whatHappensNext: row.what_happens_next,
      keyPoints: Array.isArray(row.key_points) ? row.key_points : [],
      category: row.category,
      tags: Array.isArray(row.tags) ? row.tags : [],
      slug: row.slug,
      image: row.image,
      imageCaption: row.image_caption,
      imageCredit: row.image_credit,
      publishedAt: row.published_at,
      updatedAt: row.updated_at,
      confidenceScore: row.confidence_score,
      status: row.status,
      isBreaking: row.is_breaking,
      isTrending: row.is_trending,
      views: row.views || 0,
      shares: row.shares || 0,
      readingTimeMinutes: row.reading_time_minutes || 3,
      requiresReview: row.requires_review || false,
      primarySourceName: row.primary_source_name,
      primarySourceUrl: row.primary_source_url,
      sources: Array.isArray(row.sources) ? row.sources : [],
      seoTitle: row.seo_title,
      metaDescription: row.meta_description,
      canonicalUrl: row.canonical_url,
      aiModelUsed: row.ai_model_used
    }));
  } catch (err) {
    console.warn('Supabase fetch failed, continuing with local engine:', err);
    return null;
  }
}

export async function syncStoryToSupabase(story: Story): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('stories').upsert({
      id: story.id,
      cluster_id: story.clusterId,
      headline: story.headline,
      summary: story.summary,
      article: story.article,
      what_happened: story.whatHappened,
      main_story: story.mainStory,
      background: story.background,
      what_happens_next: story.whatHappensNext,
      key_points: story.keyPoints,
      category: story.category,
      tags: story.tags,
      slug: story.slug,
      image: story.image,
      image_caption: story.imageCaption,
      image_credit: story.imageCredit,
      published_at: story.publishedAt,
      updated_at: story.updatedAt,
      confidence_score: story.confidenceScore,
      status: story.status,
      is_breaking: story.isBreaking,
      is_trending: story.isTrending,
      views: story.views,
      shares: story.shares,
      reading_time_minutes: story.readingTimeMinutes,
      requires_review: story.requiresReview,
      primary_source_name: story.primarySourceName,
      primary_source_url: story.primarySourceUrl,
      sources: story.sources,
      seo_title: story.seoTitle,
      meta_description: story.metaDescription,
      canonical_url: story.canonicalUrl,
      ai_model_used: story.aiModelUsed
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Supabase story sync error:', err);
    return false;
  }
}

export function getSupabaseSchemaSql(): string {
  return `-- ========================================================
-- Nigerian AI News Hub - Supabase PostgreSQL Schema
-- Database tables for Stories, Top 5 Sources, & Groq Chat Logs
-- ========================================================

-- 1. Create Stories Table
CREATE TABLE IF NOT EXISTS public.stories (
  id TEXT PRIMARY KEY,
  cluster_id TEXT,
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  article TEXT,
  what_happened TEXT,
  main_story TEXT,
  background TEXT,
  what_happens_next TEXT,
  key_points JSONB DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  image_caption TEXT,
  image_credit TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confidence_score INTEGER DEFAULT 95,
  status TEXT DEFAULT 'published',
  is_breaking BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 3,
  requires_review BOOLEAN DEFAULT false,
  primary_source_name TEXT NOT NULL,
  primary_source_url TEXT NOT NULL,
  sources JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  ai_model_used TEXT DEFAULT 'gemini-3.7-flash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Sources Table
CREATE TABLE IF NOT EXISTS public.sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'rss',
  rss_url TEXT NOT NULL,
  website_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  priority TEXT DEFAULT 'high',
  trust_score INTEGER DEFAULT 95,
  active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMPTZ,
  logo_url TEXT,
  description TEXT,
  is_top_five BOOLEAN DEFAULT false,
  total_articles_count INTEGER DEFAULT 0
);

-- 3. Create Groq Chat Logs Table
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_query TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  model_used TEXT DEFAULT 'llama-3.3-70b-versatile',
  sources_cited JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published stories and active sources
CREATE POLICY "Public can read published stories"
  ON public.stories FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can read active sources"
  ON public.sources FOR SELECT
  USING (active = true);

CREATE POLICY "Allow anonymous chat logging"
  ON public.chat_history FOR INSERT
  WITH CHECK (true);
`;
}
