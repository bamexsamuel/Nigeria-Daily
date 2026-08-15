import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenPolicy: (type: 'editorial' | 'ai' | 'about' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenPolicy }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="site-footer" className="bg-[#0F172A] text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Newsletter Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs mb-1">
                <Mail className="w-4 h-4 text-[#008751]" />
                Daily Nigerian News Digest
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif mb-2">
                Top 10 Nigerian Stories Every Morning (7:00 AM WAT)
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Curated and synthesized by Google Gemini from Channels TV, Punch, Premium Times, Vanguard, and The Guardian.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">You are subscribed!</p>
                    <p className="text-xs text-emerald-400/90">Look out for tomorrow morning’s AI synthesis in your inbox.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email (e.g. name@company.ng)"
                    className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#008751] text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 bg-[#008751] hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 disabled:opacity-50 shadow-xs"
                  >
                    {loading ? 'Subscribing...' : 'Get Daily Digest'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#008751] text-white flex items-center justify-center font-black text-sm shadow-xs border border-emerald-700">
                N
              </div>
              <span className="text-base font-black text-white font-serif">
                Nigeria <span className="text-emerald-400">Daily</span> AI Hub
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Autonomous Nigerian news intelligence platform delivering factual, synthesized dispatches with source attribution.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Google Gemini
            </div>
          </div>

          {/* Top 5 Channels */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Top 5 Channels
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.channelstv.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                  Channels Television (Broadcasting)
                </a>
              </li>
              <li>
                <a href="https://punchng.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                  The Punch (Daily Newspaper)
                </a>
              </li>
              <li>
                <a href="https://www.premiumtimesng.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                  Premium Times (Investigative)
                </a>
              </li>
              <li>
                <a href="https://www.vanguardngr.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                  Vanguard News (National & Sports)
                </a>
              </li>
              <li>
                <a href="https://guardian.ng" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                  The Guardian Nigeria (Policy & Editorial)
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {['Politics', 'Business', 'Technology', 'Crime & Security', 'Sports', 'Education', 'Health'].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Editorial Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenPolicy('ai')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  AI Transparency Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('editorial')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Attribution & Fair Use Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('about')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  About News Hub & Contact
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPolicy('privacy')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Privacy Policy & Compliance
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Nigerian AI News Hub. All rights reserved. Content factually synthesized from authenticated Nigerian news agencies.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenPolicy('editorial')} className="hover:text-slate-300 cursor-pointer">Editorial Policy</button>
            <span>•</span>
            <button onClick={() => onOpenPolicy('privacy')} className="hover:text-slate-300 cursor-pointer">Terms & Privacy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
