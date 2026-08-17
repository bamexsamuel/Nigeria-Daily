import React, { useState } from 'react';
import { 
  Story, NewsSource, RawNewsItem, NewsroomStats, SystemSettings 
} from '../../types';
import { 
  LayoutDashboard, FileText, ShieldCheck, Play, Settings, 
  Activity, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2, 
  Flame, TrendingUp, Plus, ExternalLink, Database, Newspaper,
  BarChart3, LogOut, User, ShieldAlert
} from 'lucide-react';
import { useAdminAuth } from '../../context/AuthContext';
import { ArticlesManager } from './ArticlesManager';
import { SourcesManager } from './SourcesManager';
import { PipelineRunner } from './PipelineRunner';
import { SettingsView } from './SettingsView';
import { SystemHealth } from './SystemHealth';
import { SupabaseManager } from './SupabaseManager';
import { AnalyticsAnalysisView } from './AnalyticsAnalysisView';

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

type AdminTab = 'overview' | 'analysis' | 'articles' | 'sources' | 'pipeline' | 'health' | 'supabase' | 'settings';

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
  const { user, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const pendingReviewCount = stories.filter(s => s.status === 'review' || s.requiresReview).length;
  const removedCount = stories.filter(s => s.status === 'rejected').length;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div id="admin-newsroom-dashboard" className="min-h-screen bg-[#F1F5F9] text-slate-900 pb-12">
      {/* Admin Top Header */}
      <header className="bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Public Blog Feed
            </button>
            <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-base text-white">
                  Nigeria Daily Newsroom
                </span>
                <span className="bg-[#008751] text-white text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                  WIRE DESK
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Editorial Control, Live Content Analysis & Post Moderation
              </p>
            </div>
          </div>

          {/* User profile & Actions */}
          <div className="flex items-center gap-2.5">
            {user && (
              <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#008751] flex items-center justify-center font-bold text-[10px] text-white">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-emerald-400 leading-none">{user.role}</p>
                </div>
              </div>
            )}

            <button
              onClick={onRefresh}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-200 hover:text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-red-800/80 transition-colors"
              title="Log out of newsroom"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'analysis', label: 'News Analysis & Audit', icon: BarChart3, highlight: true },
              { id: 'articles', label: `Dispatches & Review (${pendingReviewCount})`, icon: FileText, badge: pendingReviewCount > 0 },
              { id: 'sources', label: 'Top 5 Press Outlets', icon: ShieldCheck },
              { id: 'pipeline', label: 'Ingestion & Wire Pipeline', icon: Play },
              { id: 'supabase', label: 'Database & Sync', icon: Database },
              { id: 'health', label: 'System Health & Logs', icon: Activity },
              { id: 'settings', label: 'Editorial Desk Settings', icon: Settings }
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
                  <Icon className={`w-4 h-4 ${t.highlight && !isActive ? 'text-emerald-400' : ''}`} />
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
                  Live on Blog Today
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-slate-900 font-serif">
                    {stats.todayArticlesCount}
                  </span>
                  <span className="text-xs text-[#008751] bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Live
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Full editorial verification</span>
              </div>

              <div 
                onClick={() => setActiveTab('analysis')}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-emerald-500 cursor-pointer transition-colors"
              >
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  News Analysis & Audit
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-700 font-serif">
                    {stories.length}
                  </span>
                  <span className="text-xs text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Audit View
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Triage & remove unexpected news</span>
              </div>

              <div 
                onClick={() => setActiveTab('articles')}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-amber-400 cursor-pointer transition-colors"
              >
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Review Queue
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
                  Removed / Blocked
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-red-600 font-serif">
                    {removedCount}
                  </span>
                  <span className="text-xs text-red-700 bg-red-50 font-bold px-2 py-0.5 rounded-full border border-red-200">
                    Taken Down
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Blocked from public audience</span>
              </div>
            </div>

            {/* Quick Actions & Pipeline Trigger Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                  <Newspaper className="w-4 h-4" />
                  National News Wire & Analysis Desk
                </div>
                <h3 className="text-lg font-black font-serif">
                  Automated Content Discovery & Editorial Post Moderation
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Analyze ingested dispatches from The Punch, Channels TV, Premium Times, Vanguard, and The Guardian to immediately remove or approve stories for the public blog post feed.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setActiveTab('analysis')}
                  className="px-4 py-2.5 bg-[#008751] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4" /> Open News Analysis
                </button>
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <Play className="w-4 h-4" /> Run Pipeline
                </button>
              </div>
            </div>

            {/* Recent Articles & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900 font-serif">
                    Latest Dispatches & Moderation
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
                          <span className={`font-mono font-bold ${story.status === 'rejected' ? 'text-red-600' : 'text-emerald-700'}`}>
                            {story.status === 'rejected' ? 'REMOVED' : `${story.confidenceScore}% Corroborated`}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 font-serif truncate">
                          {story.headline}
                        </h4>
                      </div>

                      <button
                        onClick={() => onSelectStory(story)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold shrink-0 cursor-pointer"
                      >
                        Inspect
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
                  <p className="font-semibold text-slate-700">Editorial Quality Policy:</p>
                  <p>Unverified, offensive, or off-topic posts can be taken down immediately via the Analysis or Dispatches tab.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANALYSIS & AUDIT */}
        {activeTab === 'analysis' && (
          <AnalyticsAnalysisView
            stories={stories}
            sources={sources}
            stats={stats}
            onRefresh={onRefresh}
            onSelectStory={onSelectStory}
          />
        )}

        {/* TAB 3: ARTICLES */}
        {activeTab === 'articles' && (
          <ArticlesManager
            stories={stories}
            onRefresh={onRefresh}
            onSelectStory={onSelectStory}
          />
        )}

        {/* TAB 4: SOURCES */}
        {activeTab === 'sources' && (
          <SourcesManager
            sources={sources}
            onRefresh={onRefresh}
          />
        )}

        {/* TAB 5: PIPELINE */}
        {activeTab === 'pipeline' && (
          <PipelineRunner
            rawQueue={rawQueue}
            onRefresh={onRefresh}
            onSelectStory={onSelectStory}
          />
        )}

        {/* TAB 6: SUPABASE & VERCEL */}
        {activeTab === 'supabase' && (
          <SupabaseManager
            stories={stories}
          />
        )}

        {/* TAB 7: SYSTEM HEALTH */}
        {activeTab === 'health' && (
          <SystemHealth
            stats={stats}
            onRefresh={onRefresh}
          />
        )}

        {/* TAB 8: SETTINGS */}
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
