import React from 'react';
import { NewsSource } from '../types';
import { ShieldCheck, Newspaper, Layers } from 'lucide-react';

interface SourceFilterTabsProps {
  sources: NewsSource[];
  selectedSourceId: string | null;
  onSelectSource: (sourceId: string | null) => void;
}

export const SourceFilterTabs: React.FC<SourceFilterTabsProps> = ({
  sources,
  selectedSourceId,
  onSelectSource
}) => {
  // Show top 5 sources prominently
  const topFive = sources.filter(s => s.isTopFive);

  return (
    <div id="source-filter-container" className="bg-white border border-slate-200/90 rounded-xl p-3.5 mb-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#008751]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Top 5 Nigerian Press & Wire Desks
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          Direct newsroom feeds: Channels TV • The Punch • Premium Times • Vanguard • The Guardian
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="source-filter-all"
          onClick={() => onSelectSource(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            selectedSourceId === null
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          All Sources
        </button>

        {topFive.map(source => {
          const isSelected = selectedSourceId === source.id;
          return (
            <button
              key={source.id}
              id={`source-filter-${source.id}`}
              onClick={() => onSelectSource(isSelected ? null : source.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#008751] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{source.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold ${
                  isSelected ? 'bg-emerald-900 text-emerald-100' : 'bg-emerald-50 text-[#008751] border border-emerald-200/60'
                }`}
              >
                {source.trustScore}% Score
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
