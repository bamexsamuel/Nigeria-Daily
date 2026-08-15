import React from 'react';
import { Story } from '../types';
import { Clock, ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ArticleCardProps {
  story: Story;
  onSelectStory: (story: Story) => void;
  compact?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  story,
  onSelectStory,
  compact = false
}) => {
  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (compact) {
    return (
      <div
        id={`article-card-${story.id}`}
        onClick={() => onSelectStory(story)}
        className="group bg-white border border-slate-200/90 rounded-xl p-3 hover:border-[#008751]/60 hover:shadow-xs transition-all cursor-pointer flex gap-3"
      >
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0">
          <img
            src={story.image}
            alt={story.headline}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-0.5">
              <span className="font-bold text-[#008751] uppercase">{story.category}</span>
              <span>•</span>
              <span className="truncate font-medium">{story.primarySourceName}</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 font-serif line-clamp-2 group-hover:text-[#008751] leading-snug">
              {story.headline}
            </h4>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
            <span>{timeAgo(story.publishedAt)}</span>
            <span className="font-mono text-[#008751] font-bold">{story.confidenceScore}% Corroborated</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article
      id={`article-card-${story.id}`}
      onClick={() => onSelectStory(story)}
      className="group bg-white border border-slate-200/90 rounded-xl overflow-hidden hover:border-[#008751]/70 hover:shadow-md transition-all cursor-pointer flex flex-col h-full shadow-2xs"
    >
      {/* Image */}
      <div className="relative aspect-16/10 w-full bg-slate-900 overflow-hidden">
        <img
          src={story.image}
          alt={story.headline}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-[#0F172A]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
            {story.category}
          </span>
          {story.isBreaking && (
            <span className="bg-[#991B1B] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded animate-pulse shadow-xs">
              Breaking
            </span>
          )}
        </div>
        <div className="absolute bottom-2 right-2 bg-slate-950/90 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/30 font-bold">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {story.confidenceScore}% Fact Score
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Source Attribution Pill */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#008751]" />
            <span className="font-semibold text-slate-800 truncate">{story.primarySourceName}</span>
            {story.sources.length > 1 && (
              <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded font-medium">
                +{story.sources.length - 1} outlets
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-950 font-serif leading-snug group-hover:text-[#008751] transition-colors line-clamp-2 mb-2">
            {story.headline}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3 font-sans">
            {story.summary}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            {timeAgo(story.publishedAt)}
          </span>
          <span className="text-[#008751] font-bold group-hover:underline flex items-center gap-0.5">
            Read Dispatch <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </article>
  );
};
