import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldCheck, Radio, LayoutDashboard, Menu, X, Clock, 
  Newspaper, FileText, CheckCircle2, Lock, UserCheck, LogOut, RefreshCw
} from 'lucide-react';
import { useAdminAuth } from '../context/AuthContext';

interface HeaderProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
  onOpenPolicy: (type: 'editorial' | 'ai' | 'about' | 'privacy') => void;
  onSelectStoryById?: (id: string) => void;
  breakingStories?: Array<{ id: string; headline: string; category: string }>;
  onOpenGroqChat?: () => void;
  onSyncLiveWire?: () => void;
  isRefreshing?: boolean;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All News', value: 'All' },
  { label: 'Politics', value: 'Politics' },
  { label: 'Business & Economy', value: 'Business' },
  { label: 'Technology', value: 'Technology' },
  { label: 'Crime & Security', value: 'Crime & Security' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Education', value: 'Education' },
  { label: 'Health', value: 'Health' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'World', value: 'World' }
];

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onSearch,
  searchQuery,
  onOpenAdmin,
  isAdminOpen,
  onOpenPolicy,
  onSelectStoryById,
  breakingStories = [],
  onOpenGroqChat,
  onSyncLiveWire,
  isRefreshing = false
}) => {
  const { isAuthenticated, user, logout } = useAdminAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeBreakingIdx, setActiveBreakingIdx] = useState(0);

  // Live West Africa Time (WAT)
  useEffect(() => {
    const updateWatTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Lagos',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTime(new Intl.DateTimeFormat('en-GB', options).format(now) + ' (WAT)');
    };

    updateWatTime();
    const timer = setInterval(updateWatTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Breaking ticker rotation
  useEffect(() => {
    if (breakingStories.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBreakingIdx(prev => (prev + 1) % breakingStories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [breakingStories]);

  return (
    <header id="site-header" className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top Meta Utility Bar */}
      <div id="top-utility-bar" className="bg-[#0B132B] text-slate-300 text-xs py-2 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wider text-[11px] uppercase">
              <span className="inline-block w-2 h-2 rounded-full bg-[#008751] animate-ping"></span>
              NATIONAL WIRE
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {currentTime || 'Lagos, Nigeria (WAT)'}
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:inline text-slate-300 text-xs">
              Verified Outlets: <strong className="text-white font-semibold">The Punch • Channels TV • Premium Times • Vanguard • The Guardian</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenPolicy('editorial')}
              className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Editorial Standards & Verification
            </button>
            <span className="text-slate-700">|</span>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  id="admin-portal-toggle-btn"
                  onClick={onOpenAdmin}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    isAdminOpen
                      ? 'bg-[#008751] text-white shadow-xs'
                      : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700'
                  }`}
                  title="Enter Admin Newsroom Desk"
                >
                  <LayoutDashboard className="w-3 h-3 text-emerald-400" />
                  <span>{isAdminOpen ? 'Exit Newsroom' : 'Newsroom Desk (Admin)'}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Sign out of editorial desk"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                id="admin-portal-toggle-btn"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all cursor-pointer"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Newsroom Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Breaking News Ticker Bar */}
      {breakingStories.length > 0 && (
        <div id="breaking-ticker-bar" className="bg-[#991B1B] text-white text-xs px-4 sm:px-6 py-2 overflow-hidden border-b border-red-900">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-black tracking-wider uppercase shrink-0 bg-red-950 px-2 py-0.5 rounded text-[10px] border border-red-800">
              <Radio className="w-3 h-3 animate-pulse text-red-300" />
              BREAKING DISPATCH
            </div>
            <div className="flex-1 truncate">
              {breakingStories[activeBreakingIdx] && (
                <button
                  onClick={() => onSelectStoryById?.(breakingStories[activeBreakingIdx].id)}
                  className="hover:underline font-medium cursor-pointer text-left truncate block w-full text-white"
                >
                  <span className="font-bold text-red-200 mr-2">[{breakingStories[activeBreakingIdx].category}]:</span>
                  {breakingStories[activeBreakingIdx].headline}
                </button>
              )}
            </div>
            <div className="text-[10px] text-red-200 font-mono shrink-0 hidden sm:block">
              {activeBreakingIdx + 1} of {breakingStories.length}
            </div>
          </div>
        </div>
      )}

      {/* Main Brand & Search Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#008751] text-white flex items-center justify-center font-serif font-black text-2xl shadow-md border-2 border-white/20 shrink-0">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black font-serif tracking-tight text-slate-950">
                  Nigeria Daily Dispatch
                </span>
                <span className="bg-[#008751] text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase font-mono shadow-2xs">
                  DIRECT WIRE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Corroborated National News from Top 5 Verified Press Agencies
              </p>
            </div>
          </div>

          {/* Search Field (Desktop) */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md ml-auto">
            <div className="relative w-full">
              <input
                id="search-news-input"
                type="text"
                value={searchQuery}
                onChange={e => onSearch(e.target.value)}
                placeholder="Search politics, economy, CBN, FAAC, security, sports..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#008751] focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search Nigerian dispatches..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#008751]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav id="category-navigation-bar" className="bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none flex-1">
            {CATEGORIES.map(cat => {
              const isSelected = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  id={`cat-nav-${cat.value.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onSelectCategory(cat.value)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {onSyncLiveWire && (
            <button
              id="sync-live-wire-header-btn"
              onClick={onSyncLiveWire}
              disabled={isRefreshing}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#008751] font-bold text-xs rounded-lg border border-emerald-300 transition-all cursor-pointer shrink-0 shadow-2xs disabled:opacity-50"
              title="Fetch fresh real-time RSS news from top Nigerian press agencies"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing Wire...' : 'Sync Live Wire'}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 p-4 shadow-xl space-y-4 animate-fade-in">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Browse Topics
            </span>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => {
                    onSelectCategory(cat.value);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-xs p-2 rounded-lg font-semibold ${
                    activeCategory === cat.value ? 'bg-[#008751] text-white' : 'bg-slate-50 text-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <button
              onClick={() => {
                onOpenPolicy('editorial');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs p-2 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#008751]" />
              Editorial Integrity & Methodology
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-xs p-2 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-bold"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              Newsroom Desk & Content Analysis
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
