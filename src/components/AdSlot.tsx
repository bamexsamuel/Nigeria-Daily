import React from 'react';

interface AdSlotProps {
  format: 'leaderboard' | 'rectangle' | 'in-feed';
  label?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ format, label = 'Advertisement' }) => {
  if (format === 'leaderboard') {
    return (
      <div className="my-6 max-w-5xl mx-auto px-4 text-center">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
          {label}
        </span>
        <div className="h-24 sm:h-28 w-full bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs font-mono">
          <div className="text-center">
            <p className="font-semibold text-slate-600">Google AdSense / Direct Nigerian Brand Slot</p>
            <p className="text-[11px] text-slate-400">Responsive Leaderboard (728x90 / 970x250)</p>
          </div>
        </div>
      </div>
    );
  }

  if (format === 'rectangle') {
    return (
      <div className="my-4 text-center">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
          {label}
        </span>
        <div className="h-64 w-full bg-slate-100 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs font-mono p-4">
          <div className="text-center">
            <p className="font-semibold text-slate-600">Sponsored Ad Space</p>
            <p className="text-[11px] text-slate-400">Medium Rectangle (300x250 / 336x280)</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3 text-center">
      <span className="text-[10px] text-slate-400 uppercase font-mono block">
        {label} • In-Feed Native Space
      </span>
    </div>
  );
};
