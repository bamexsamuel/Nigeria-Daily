import React from 'react';
import { Story } from '../types';
import { Flame, Eye, TrendingUp } from 'lucide-react';

interface TrendingSidebarProps {
  trendingStories: Story[];
  onSelectStory: (story: Story) => void;
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  trendingStories,
  onSelectStory
}) => {
  return (
    <div id="trending-news-sidebar" className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-600" />
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Trending in Nigeria
          </h2>
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
      </div>

      <div className="flex flex-col gap-3">
        {trendingStories.slice(0, 5).map((story, index) => (
          <div
            key={story.id}
            id={`trending-item-${index + 1}`}
            onClick={() => onSelectStory(story)}
            className="group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50/80 transition-colors cursor-pointer"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                index === 0
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : index === 1
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : index === 2
                  ? 'bg-orange-100 text-orange-950'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {index + 1}
            </span>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#008751] uppercase block mb-0.5">
                {story.category}
              </span>
              <h3 className="text-xs font-bold text-slate-950 font-serif leading-snug group-hover:text-[#008751] transition-colors line-clamp-2 mb-1">
                {story.headline}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {story.views.toLocaleString()} reads
                </span>
                <span>•</span>
                <span className="text-slate-600 font-semibold">{story.primarySourceName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
