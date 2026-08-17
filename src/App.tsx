import React, { useState, useEffect, useMemo } from 'react';
import { 
  Story, NewsSource, RawNewsItem, NewsroomStats, SystemSettings 
} from './types';
import { api } from './services/api';
import { SEED_STORIES, TOP_FIVE_NIGERIAN_SOURCES, INITIAL_SETTINGS } from './data/seedData';
import { Header } from './components/Header';
import { SourceFilterTabs } from './components/SourceFilterTabs';
import { HeroLead } from './components/HeroLead';
import { ArticleCard } from './components/ArticleCard';
import { LatestNewsFeed } from './components/LatestNewsFeed';
import { TrendingSidebar } from './components/TrendingSidebar';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { PolicyModal } from './components/PolicyModal';
import { Footer } from './components/Footer';
import { AdSlot } from './components/AdSlot';
import { GroqChatBox } from './components/GroqChatBox';
import { AuthProvider, useAdminAuth } from './context/AuthContext';
import { 
  Sparkles, RefreshCw, AlertCircle, Layers, Filter, ShieldCheck, 
  Flame, Zap, ArrowRight, ShieldAlert, CheckCircle2 
} from 'lucide-react';

function AppContent() {
  const { isAuthenticated, showLoginModal, setShowLoginModal } = useAdminAuth();

  // State - seeded with initial news so content displays instantly
  const [stories, setStories] = useState<Story[]>(SEED_STORIES);
  const [sources, setSources] = useState<NewsSource[]>(TOP_FIVE_NIGERIAN_SOURCES);
  const [rawQueue, setRawQueue] = useState<RawNewsItem[]>([]);
  const [stats, setStats] = useState<NewsroomStats | null>(null);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Navigation
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Views
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [activePolicy, setActivePolicy] = useState<'editorial' | 'ai' | 'about' | 'privacy' | null>(null);
  
  // Groq Chat State
  const [isGroqChatOpen, setIsGroqChatOpen] = useState(false);
  const [groqChatQuery, setGroqChatQuery] = useState('');

  // Resilient data loading from API
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      setError(null);
      const [storiesData, sourcesData, rawData, statsData, settingsData] = await Promise.allSettled([
        api.getStories(),
        api.getSources(),
        api.getRawQueue(),
        api.getStats(),
        api.getSettings()
      ]);

      if (storiesData.status === 'fulfilled' && storiesData.value && storiesData.value.length > 0) {
        setStories(storiesData.value);
      }
      if (sourcesData.status === 'fulfilled' && sourcesData.value && sourcesData.value.length > 0) {
        setSources(sourcesData.value);
      }
      if (rawData.status === 'fulfilled' && rawData.value) {
        setRawQueue(rawData.value);
      }
      if (statsData.status === 'fulfilled' && statsData.value) {
        setStats(statsData.value);
      }
      if (settingsData.status === 'fulfilled' && settingsData.value) {
        setSettings(settingsData.value);
      }
    } catch (err: any) {
      console.error('Failed to refresh data', err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto poll every 45s for fresh Nigerian news updates
    const interval = setInterval(() => {
      api.getStories().then(res => {
        if (res && res.length > 0) setStories(res);
      }).catch(() => {});
      api.getStats().then(setStats).catch(() => {});
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const handleSyncLiveWire = async () => {
    setIsRefreshing(true);
    try {
      await api.syncAllSources();
      const updatedStories = await api.getStories();
      setStories(updatedStories);
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRemoveStory = (storyId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId));
    if (selectedStory?.id === storyId) {
      setSelectedStory(null);
    }
  };

  // Filtered stories for public display (only published stories)
  const publishedStories = useMemo(() => {
    return stories.filter(s => s.status === 'published');
  }, [stories]);

  const filteredStories = useMemo(() => {
    return publishedStories.filter(story => {
      // Category filter
      if (selectedCategory !== 'All' && story.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Top 5 Source filter
      if (selectedSourceId) {
        const targetSource = sources.find(s => s.id === selectedSourceId);
        const matchesId = story.sources?.some(s => s.sourceId === selectedSourceId);
        const matchesName = targetSource && story.primarySourceName.toLowerCase().includes(targetSource.name.toLowerCase());
        if (!matchesId && !matchesName) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inHeadline = story.headline.toLowerCase().includes(q);
        const inSummary = story.summary.toLowerCase().includes(q);
        const inSource = story.primarySourceName.toLowerCase().includes(q);
        const inTags = story.tags?.some(t => t.toLowerCase().includes(q));
        return inHeadline || inSummary || inSource || inTags;
      }
      return true;
    });
  }, [publishedStories, selectedCategory, selectedSourceId, searchQuery, sources]);

  // Breaking stories for top ticker
  const breakingStories = useMemo(() => {
    const breaking = publishedStories.filter(s => s.isBreaking);
    return breaking.length > 0 ? breaking : publishedStories.slice(0, 3);
  }, [publishedStories]);

  // Trending stories sorted by views
  const trendingStories = useMemo(() => {
    return [...publishedStories].sort((a, b) => b.views - a.views);
  }, [publishedStories]);

  // Lead story and secondary
  const leadStory = filteredStories.length > 0 ? filteredStories[0] : publishedStories[0];
  const secondaryStories = filteredStories.length > 1 ? filteredStories.slice(1, 4) : publishedStories.slice(1, 4);
  const remainingStories = filteredStories.length > 4 ? filteredStories.slice(4) : [];

  const handleSelectStory = async (story: Story) => {
    setSelectedStory(story);
    try {
      await api.incrementStoryViews(story.id);
      setStories(prev => prev.map(s => s.id === story.id ? { ...s, views: s.views + 1 } : s));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAdmin = () => {
    if (viewMode === 'admin') {
      setViewMode('public');
    } else {
      if (!isAuthenticated) {
        setShowLoginModal(true);
      } else {
        setViewMode('admin');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center font-serif font-black text-2xl mb-4 animate-bounce">
          N
        </div>
        <h1 className="text-xl font-bold font-serif mb-2">Nigerian AI News Hub</h1>
        <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Ingesting Top 5 Nigerian RSS Feeds & Gemini Synthesis...
        </p>
      </div>
    );
  }

  // Admin View (Protected)
  if (viewMode === 'admin' && isAuthenticated && stats && settings) {
    return (
      <AdminDashboard
        stats={stats}
        stories={stories}
        sources={sources}
        rawQueue={rawQueue}
        settings={settings}
        onRefresh={loadData}
        onClose={() => setViewMode('public')}
        onSelectStory={handleSelectStory}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <Header
        activeCategory={selectedCategory}
        onSelectCategory={cat => {
          setSelectedCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        breakingStories={breakingStories}
        onSelectStoryById={id => {
          const story = stories.find(s => s.id === id);
          if (story) handleSelectStory(story);
        }}
        onOpenAdmin={handleToggleAdmin}
        isAdminOpen={viewMode === 'admin'}
        onOpenPolicy={setActivePolicy}
        onOpenGroqChat={() => {
          setGroqChatQuery('');
          setIsGroqChatOpen(true);
        }}
        onSyncLiveWire={handleSyncLiveWire}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Top 5 Nigerian Sources Filter Bar */}
        <SourceFilterTabs
          sources={sources}
          selectedSourceId={selectedSourceId}
          onSelectSource={setSelectedSourceId}
        />

        {/* Filter State Feedback Bar */}
        {(selectedCategory !== 'All' || selectedSourceId || searchQuery) && (
          <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Filter className="w-3.5 h-3.5 text-emerald-700" /> Active Filter:
              </span>
              {selectedCategory !== 'All' && (
                <span className="bg-slate-900 text-white px-2.5 py-0.5 rounded-md font-semibold text-xs shadow-xs">
                  {selectedCategory}
                </span>
              )}
              {selectedSourceId && (
                <span className="bg-[#008751] text-white px-2.5 py-0.5 rounded-md font-semibold text-xs shadow-xs">
                  {sources.find(s => s.id === selectedSourceId)?.name}
                </span>
              )}
              {searchQuery && (
                <span className="bg-amber-100 text-amber-950 border border-amber-300/80 px-2.5 py-0.5 rounded-md font-semibold text-xs">
                  "{searchQuery}"
                </span>
              )}
              <span className="text-slate-500 font-medium ml-1">({filteredStories.length} dispatches verified)</span>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSourceId(null);
                setSearchQuery('');
              }}
              className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {filteredStories.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center my-8 shadow-xs">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold font-serif text-slate-900 mb-1">
              No matching Nigerian dispatches found
            </h2>
            <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
              No reports matching your criteria in the continuous feed. Try clearing search keywords or selecting "All Channels".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSourceId(null);
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              Show All Stories
            </button>
          </div>
        ) : (
          <>
            {/* HERO LEAD SECTION (Lead + 3 dispatches) */}
            {leadStory && !searchQuery && selectedCategory === 'All' && (
              <HeroLead
                leadStory={leadStory}
                secondaryStories={secondaryStories}
                onSelectStory={handleSelectStory}
              />
            )}

            {/* Top Leaderboard Ad Slot */}
            <AdSlot format="leaderboard" label="Sponsored Placement" />

            {/* THE INTELLIGENCE BRIEF FEATURE BANNER */}
            <div id="the-intelligence-brief-banner" className="bg-[#0F172A] text-white rounded-2xl p-5 sm:p-6 mb-8 border border-slate-800 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-[#008751] flex items-center justify-center font-bold text-white shadow-xs">
                      <Zap className="w-3.5 h-3.5 text-emerald-200" />
                    </div>
                    <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                      The Intelligence Brief
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="bg-orange-500/20 text-orange-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-orange-500/30">
                      Groq LPU™ AI Chat
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-black font-serif text-white tracking-tight">
                    Instant Answers on Nigerian Policy, Economy, Politics & Sports
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Powered by high-speed Groq LPU inference grounded on verified dispatches from Channels TV, The Punch, Premium Times, Vanguard, and The Guardian Nigeria.
                  </p>

                  {/* Interactive Quick Inquiries */}
                  <div className="flex flex-wrap gap-2 mt-3.5">
                    {[
                      'CBN FX & Naira Policy',
                      'FEC ₦1.8T Infrastructure Funds',
                      'Super Eagles Camp in Uyo',
                      'Lagos $250M AI Data Center'
                    ].map((topic, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setGroqChatQuery(`What is the latest intelligence on ${topic}?`);
                          setIsGroqChatOpen(true);
                        }}
                        className="text-[11px] bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors cursor-pointer flex items-center gap-1 font-medium"
                      >
                        <Zap className="w-3 h-3 text-emerald-400" />
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <button
                    id="open-intelligence-brief-btn"
                    onClick={() => {
                      setGroqChatQuery('');
                      setIsGroqChatOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-[#008751] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-103 transition-transform cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-emerald-200" />
                    Open The Intelligence Brief
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN 3-COLUMN EDITORIAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Feed Column (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#008751]"></span>
                    {selectedCategory === 'All' ? 'Curated Nigerian Dispatches' : `${selectedCategory} News`}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    {filteredStories.length} Verified Reports
                  </span>
                </div>

                {/* Article Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {(searchQuery || selectedCategory !== 'All' ? filteredStories : remainingStories).map(story => (
                    <ArticleCard
                      key={story.id}
                      story={story}
                      onSelectStory={handleSelectStory}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar Column (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Real-time Chronological Latest Feed */}
                <LatestNewsFeed
                  stories={publishedStories}
                  onSelectStory={handleSelectStory}
                />

                {/* Medium Rectangle Ad Slot */}
                <AdSlot format="rectangle" label="Sponsored Content" />

                {/* Trending in Nigeria Sidebar */}
                <TrendingSidebar
                  trendingStories={trendingStories}
                  onSelectStory={handleSelectStory}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Article Detail Modal */}
      {selectedStory && (
        <ArticleDetailModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          onSelectRelatedStory={handleSelectStory}
          allStories={publishedStories}
          onStoryUpdated={loadData}
          onStoryRemoved={handleRemoveStory}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setViewMode('admin')}
      />

      {/* Policy & Transparency Modals */}
      {activePolicy && (
        <PolicyModal
          type={activePolicy}
          onClose={() => setActivePolicy(null)}
        />
      )}

      {/* Site Footer */}
      <Footer
        onSelectCategory={cat => {
          setSelectedCategory(cat);
          setSelectedSourceId(null);
          setSearchQuery('');
        }}
        onOpenPolicy={setActivePolicy}
      />

      {/* Groq AI News Chat Box Modal / Floating Launcher */}
      <GroqChatBox
        isOpen={isGroqChatOpen}
        onToggle={() => setIsGroqChatOpen(!isGroqChatOpen)}
        initialQuery={groqChatQuery}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
