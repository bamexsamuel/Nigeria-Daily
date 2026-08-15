import React from 'react';
import { NewsroomStats } from '../../types';
import { 
  Activity, CheckCircle2, ShieldCheck, Database, 
  Cpu, DollarSign, Clock, AlertTriangle, Layers 
} from 'lucide-react';

interface SystemHealthProps {
  stats: NewsroomStats;
  onRefresh: () => void;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ stats, onRefresh }) => {
  const metrics = [
    { label: 'Gemini AI Synthesis Service', status: 'Operational', latency: '420ms', icon: Cpu, color: 'text-[#008751]' },
    { label: 'Top 5 RSS Ingestion Feeds', status: `${stats.sourcesOnlineCount}/${stats.totalSourcesCount} Online`, latency: '1.2s', icon: ShieldCheck, color: 'text-[#008751]' },
    { label: 'Deduplication & Story Cluster Cache', status: `${stats.duplicateBlockedCount} Dupes Filtered`, latency: '< 5ms', icon: Database, color: 'text-[#008751]' },
    { label: 'Review Queue Safety Gate', status: `${stats.pendingReviewCount} In Queue`, latency: 'Real-time', icon: AlertTriangle, color: 'text-amber-500' }
  ];

  return (
    <div className="space-y-6">
      {/* System Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${m.color}`} />
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#008751] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008751]"></span>
                  Active
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">{m.label}</h4>
              <p className="text-xs font-semibold text-slate-700">{m.status}</p>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">Avg Latency: {m.latency}</span>
            </div>
          );
        })}
      </div>

      {/* AI Token and Cost Tracking (PRD Section 36) */}
      <div className="bg-[#0F172A] text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-[#008751]" />
          AI Token Accounting & Cost Efficiency
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block mb-0.5">Estimated Processed Tokens</span>
            <span className="text-xl font-black text-white font-mono">{stats.estimatedTokensUsed.toLocaleString()}</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block mb-0.5">Estimated AI Compute Cost</span>
            <span className="text-xl font-black text-emerald-400 font-mono">${stats.aiCostEstimateUsd} USD</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block mb-0.5">Duplicate Stories Blocked from AI</span>
            <span className="text-xl font-black text-amber-400 font-mono">{stats.duplicateBlockedCount} Saved</span>
          </div>
        </div>
      </div>

      {/* Recent Processing Jobs Log */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 font-serif mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#008751]" />
          Recent Ingestion & Synthesis Processing Jobs
        </h3>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {stats.recentJobs.map(job => (
            <div key={job.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    job.status === 'completed' ? 'bg-[#008751]' : job.status === 'running' ? 'bg-amber-500 animate-ping' : 'bg-red-500'
                  }`}
                ></span>
                <div>
                  <p className="font-semibold text-slate-800">{job.headline}</p>
                  <p className="text-[10px] text-slate-400">
                    Channel: {job.sourceName} • Started: {new Date(job.startedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {job.confidenceScore && (
                  <span className="font-mono text-[#008751] text-[11px] font-bold">
                    {job.confidenceScore}% Score
                  </span>
                )}
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  {job.stage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
