import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Radio, LayoutDashboard, Menu, X, Clock, Newspaper, FileText, CheckCircle2 } from 'lucide-react';

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
  onOpenGroqChat
}) => {
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
            <button
              id="admin-portal-toggle-btn"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                isAdminOpen
                  ? 'bg-[#008751] text-white shadow-xs'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <LayoutDashboard className="w-3 h-3" />
              {isAdminOpen ? 'Exit Newsroom' : 'Newsroom Desk'}
            </button>
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
          </div>
        </div>
      )}

      {/* Main Brand & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectCategory('All')}
              className="text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#008751] text-white flex items-center justify-center font-black text-2xl shadow-sm border border-emerald-800">
                  <span className="text-emerald-50 font-serif">N</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-serif">
                      Nigeria <span className="text-[#008751]">Daily</span>
                    </span>
                    <span className="bg-slate-900 text-slate-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      DISPATCH
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 hidden sm:block font-medium tracking-normal mt-0.5">
                    Verified Multi-Source Newsroom Intelligence • Top 5 Nigerian Press Wire
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={e => onSearch(e.target.value)}
                placeholder="Search National Assembly, CBN, Naira, Judiciary, Tech..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#008751] focus:border-transparent transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* National Newsroom Desk / Wire Search Fast Action */}
          {onOpenGroqChat && (
            <button
              onClick={onOpenGroqChat}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg border border-slate-700 text-xs font-semibold shadow-xs cursor-pointer hover:border-emerald-500 transition-all"
              title="Search verified Nigerian news archive"
            >
              <Newspaper className="w-4 h-4 text-emerald-400" />
              <span>National Wire Archive</span>
              <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-700/50">
                Verified
              </span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search news, topics, institutions..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#008751]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <nav id="category-navigation-bar" className="border-t border-slate-200/90 bg-slate-100/70 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1 overflow-x-auto py-1.5 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  id={`cat-nav-${cat.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onSelectCategory(cat.value)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#008751] text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => {
                  onSelectCategory(cat.value);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                  activeCategory === cat.value
                    ? 'bg-[#008751] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => {
                onOpenPolicy('editorial');
                setMobileMenuOpen(false);
              }}
              className="text-[#008751] font-semibold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Editorial Standards
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="bg-slate-900 text-white px-3 py-1 rounded font-semibold"
            >
              Newsroom Desk
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
