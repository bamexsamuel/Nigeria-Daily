import React, { useState } from 'react';
import { 
  Story, NewsSource, RawNewsItem, NewsroomStats, SystemSettings 
} from '../../types';
import { 
  LayoutDashboard, FileText, ShieldCheck, Play, Settings, 
  Activity, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2, 
  Flame, TrendingUp, Sparkles, Plus, ExternalLink, Database
} from 'lucide-react';
import { ArticlesManager } from './ArticlesManager';
import { SourcesManager } from './SourcesManager';
import { PipelineRunner } from './PipelineRunner';
import { SettingsView } from './SettingsView';
import { SystemHealth } from './SystemHealth';
import { SupabaseManager } from './SupabaseManager';

interface AdminDashboardProps {
  stats: NewsroomStats;
  stories: Story[];
  sources: NewsSource[];
  rawQueue: RawNewsItem[];
  settings: SystemSettings;
  onRefresh: () => void;
  onClose: () => void;
  onSelectStory: (story: Story) => void;
}

type AdminTab = 'overview' | 'articles' | 'sources' | 'pipeline' | 'health' | 'supabase' | 'settings';


export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  stories,
  sources,
  rawQueue,
  settings,
  onRefresh,
  onClose,
  onSelectStory
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const pendingReviewCount = stories.filter(s => s.status === 'review' || s.requiresReview).length;

  return (
    <div id="admin-newsroom-dashboard" className="min-h-screen bg-[#F1F5F9] text-slate-900 pb-12">
      {/* Admin Top Header */}
      <header className="bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Public View
            </button>
            <div className="h-5 w-px bg-slate-700"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-base text-white">
                  Nigerian AI Newsroom
                </span>
                <span className="bg-[#008751] text-white text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                  PROD v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Top 5 Channels Autonomous Ingestion & Editorial Controller
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'articles', label: `Articles & Review (${pendingReviewCount})`, icon: FileText, badge: pendingReviewCount > 0 },
              { id: 'sources', label: 'Top 5 Sources', icon: ShieldCheck },
              { id: 'pipeline', label: 'AI Ingestion Pipeline', icon: Play },
              { id: 'supabase', label: 'Supabase & Vercel Sync', icon: Database },
              { id: 'health', label: 'System Health & Logs', icon: Activity },
              { id: 'settings', label: 'Editorial AI Settings', icon: Settings }
            ].map(t => {

              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  id={`admin-tab-${t.id}`}
                  onClick={() => setActiveTab(t.id as AdminTab)}
                  className={`px-3.5 py-2.5 text-xs font-bold rounded-t-lg flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F1F5F9] text-slate-950 border-[#008751] font-black'
                      : 'text-slate-400 hover:text-slate-200 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {t.badge && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Published Today
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900 font-serif">
                    {stats.todayArticlesCount}
                  </span>
                  <span className="text-xs text-[#008751] bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Live
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Full AI synthesis</span>
              </div>

              <div 
                onClick={() => setActiveTab('articles')}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-400 cursor-pointer transition-colors"
              >
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pending Review Queue
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-amber-600 font-serif">
                    {stats.pendingReviewCount}
                  </span>
                  {stats.pendingReviewCount > 0 && (
                    <span className="text-xs text-amber-700 bg-amber-50 font-bold px-2 py-0.5 rounded-full animate-pulse border border-amber-200">
                      Action Needed
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Sensitive / low score flag</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Top 5 Channels Online
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900 font-serif">
                    {stats.sourcesOnlineCount} / {stats.totalSourcesCount}
                  </span>
                  <span className="text-xs text-[#008751] bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    100% Active
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Channels TV, Punch, PT, etc.</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Duplicates Filtered
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900 font-serif">
                    {stats.duplicateBlockedCount}
                  </span>
                  <span className="text-xs text-slate-600 bg-slate-100 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                    Deduped
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Tokens & cost saved</span>
              </div>
            </div>

            {/* Quick Actions & Pipeline Trigger Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                  <Sparkles className="w-4 h-4" />
                  Gemini News Synthesis Ready
                </div>
                <h3 className="text-lg font-black font-serif">
                  Automated Content Discovery & Nigerian Press Intelligence
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Run test synthesis on newly fetched dispatches from Nigerian news channels to inspect structured output.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className="px-4 py-2.5 bg-[#008751] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Play className="w-4 h-4" /> Open Ingestion Pipeline
                </button>
              </div>
            </div>

            {/* Recent Articles & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900 font-serif">
                    Latest Synthesized Dispatches
                  </h3>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    View All Articles →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {stories.slice(0, 5).map(story => (
                    <div key={story.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-0.5">
                          <span className="font-bold text-emerald-800 uppercase">{story.category}</span>
                          <span>•</span>
                          <span>{story.primarySourceName}</span>
                          <span>•</span>
                          <span className="font-mono text-emerald-700 font-bold">{story.confidenceScore}% Trust</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 font-serif truncate">
                          {story.headline}
                        </h4>
                      </div>

                      <button
                        onClick={() => onSelectStory(story)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold shrink-0 cursor-pointer"
                      >
                        Preview
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-serif pb-3 mb-3 border-b border-slate-200">
                    Category Distribution
                  </h3>
                  <div className="space-y-2.5">
                    {stats.topCategories.map(cat => (
                      <div key={cat.category} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{cat.category}</span>
                        <span className="bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 rounded">
                          {cat.count} stories
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">Auto-Publish Threshold:</p>
                  <p>Minimum {settings.minConfidenceThreshold}% confidence score required.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ARTICLES */}
        {activeTab === 'articles' && (
          <ArticlesManager
            stories={stories}
            onRefresh={onRefresh}
            onSelectStory={onSelectStory}
          />
        )}

        {/* TAB 3: SOURCES */}
        {activeTab === 'sources' && (
          <SourcesManager
            sources={sources}
            onRefresh={onRefresh}
          />
        )}

        {/* TAB 4: PIPELINE */}
        {activeTab === 'pipeline' && (
          <PipelineRunner
            rawQueue={rawQueue}
            onRefresh={onRefresh}
            onSelectStory={onSelectStory}
          />
        )}

        {/* TAB 5: SUPABASE & VERCEL */}
        {activeTab === 'supabase' && (
          <SupabaseManager
            stories={stories}
          />
        )}

        {/* TAB 6: SYSTEM HEALTH */}
        {activeTab === 'health' && (
          <SystemHealth
            stats={stats}
            onRefresh={onRefresh}
          />
        )}

        {/* TAB 7: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onRefresh={onRefresh}
          />
        )}

      </main>
    </div>
  );
};
