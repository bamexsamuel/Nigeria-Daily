import React from 'react';
import { Story } from '../types';
import { Clock, Radio, Sparkles } from 'lucide-react';

interface LatestNewsFeedProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export const LatestNewsFeed: React.FC<LatestNewsFeedProps> = ({
  stories,
  onSelectStory
}) => {
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Lagos'
    });
  };

  return (
    <div id="latest-news-feed" className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Latest Nigerian News (Live WAT)
          </h2>
        </div>
        <span className="text-[10px] text-[#008751] bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200/60">
          Auto-updating
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto pr-1">
        {stories.map(story => (
          <div
            key={story.id}
            id={`latest-item-${story.id}`}
            onClick={() => onSelectStory(story)}
            className="py-3 hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-[11px] mb-1">
              <span className="font-mono font-bold text-[#008751] flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {formatTime(story.publishedAt)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                {story.category}
              </span>
              <span className="text-slate-400 truncate text-[10px] font-medium">
                via {story.primarySourceName}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 font-serif leading-snug group-hover:text-[#008751] transition-colors line-clamp-2">
              {story.headline}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
