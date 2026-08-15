import React from 'react';
import { Story } from '../types';
import { Clock, Eye, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroLeadProps {
  leadStory: Story;
  secondaryStories: Story[];
  onSelectStory: (story: Story) => void;
}

export const HeroLead: React.FC<HeroLeadProps> = ({
  leadStory,
  secondaryStories,
  onSelectStory
}) => {
  if (!leadStory) return null;

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <section id="hero-lead-section" className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Lead Card (7 cols on lg) */}
        <div className="lg:col-span-7">
          <div
            id={`lead-story-${leadStory.id}`}
            onClick={() => onSelectStory(leadStory)}
            className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
          >
            {/* Image Container */}
            <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
              <img
                src={leadStory.image}
                alt={leadStory.headline}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              {/* Category & Confidence Badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                <span className="bg-[#008751] text-white font-bold text-xs uppercase px-2.5 py-1 rounded-md shadow-xs">
                  {leadStory.category}
                </span>
                {leadStory.isBreaking && (
                  <span className="bg-red-600 text-white font-bold text-xs uppercase px-2.5 py-1 rounded-md animate-pulse shadow-xs">
                    Breaking
                  </span>
                )}
              </div>

              {/* AI Confidence & Attribution Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                <span className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Source: {leadStory.primarySourceName}
                </span>
                <span className="flex items-center gap-1 bg-slate-950/85 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 text-[11px] font-mono">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {leadStory.confidenceScore}% AI Fact Score
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 font-serif leading-tight mb-3 group-hover:text-[#008751] transition-colors">
                  {leadStory.headline}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
                  {leadStory.summary}
                </p>

                {/* Key Takeaways snippet */}
                {leadStory.keyPoints && leadStory.keyPoints.length > 0 && (
                  <div className="bg-slate-50 border-l-3 border-[#008751] p-3 rounded-r-lg mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#008751] block mb-1">
                      Key Takeaway:
                    </span>
                    <p className="text-xs text-slate-700 italic">
                      "{leadStory.keyPoints[0]}"
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Meta */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {timeAgo(leadStory.publishedAt)}
                  </span>
                  <span>•</span>
                  <span>{leadStory.readingTimeMinutes} min read</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {leadStory.views.toLocaleString()} reads
                  </span>
                </div>
                <span className="text-[#008751] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Full Report <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stories Column (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Top Verified Nigerian Dispatches
            </h2>
            <span className="text-[11px] text-slate-400">Continuous AI update</span>
          </div>

          <div className="flex flex-col gap-3.5">
            {secondaryStories.slice(0, 3).map((story, idx) => (
              <div
                key={story.id}
                id={`secondary-story-${story.id}`}
                onClick={() => onSelectStory(story)}
                className="group bg-white border border-slate-200 rounded-xl p-3.5 hover:border-emerald-500/50 hover:shadow-xs transition-all cursor-pointer flex gap-3.5 items-start"
              >
                {/* Thumbnail */}
                <div className="w-24 sm:w-28 aspect-4/3 rounded-lg overflow-hidden bg-slate-900 shrink-0 relative">
                  <img
                    src={story.image}
                    alt={story.headline}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 bg-slate-950/80 text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 rounded">
                    #{idx + 2}
                  </span>
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      {story.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      {story.primarySourceName}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 font-serif leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1.5">
                    {story.headline}
                  </h3>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(story.publishedAt)}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium font-mono text-[10px]">
                      {story.confidenceScore}% Trust
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
