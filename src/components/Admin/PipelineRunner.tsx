import React, { useState } from 'react';
import { RawNewsItem, Story } from '../../types';
import { 
  Play, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, 
  Layers, RefreshCw, Cpu, Check, AlertCircle, FileText
} from 'lucide-react';
import { api } from '../../services/api';

interface PipelineRunnerProps {
  rawQueue: RawNewsItem[];
  onRefresh: () => void;
  onSelectStory: (story: Story) => void;
}

export const PipelineRunner: React.FC<PipelineRunnerProps> = ({
  rawQueue,
  onRefresh,
  onSelectStory
}) => {
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [lastGeneratedStory, setLastGeneratedStory] = useState<Story | null>(null);
  const [pipelineLog, setPipelineLog] = useState<string[]>([]);

  const runLivePipelineDemo = async () => {
    setRunning(true);
    setActiveStep(1);
    setLastGeneratedStory(null);
    setPipelineLog(['[Step 1] Polling Top 5 Nigerian RSS Feeds...']);

    await new Promise(r => setTimeout(r, 600));
    setActiveStep(2);
    setPipelineLog(prev => [...prev, '[Step 2] Normalizing payload, extracting enclosure media, computing SHA-256 content hashes...']);

    await new Promise(r => setTimeout(r, 600));
    setActiveStep(3);
    setPipelineLog(prev => [...prev, '[Step 3] Running duplicate check & Story Clustering algorithms... No duplicate detected.']);

    await new Promise(r => setTimeout(r, 600));
    setActiveStep(4);
    setPipelineLog(prev => [...prev, '[Step 4] Sending structured prompt to Google Gemini for Nigerian journalistic fact extraction & rewriting...']);

    try {
      const res = await api.triggerLiveDemoSynthesis();
      if (res.success && res.story) {
        setActiveStep(5);
        setPipelineLog(prev => [
          ...prev,
          `[Step 5] Quality Gate Passed. Fact Confidence Score: ${res.story.confidenceScore}%. Status: ${res.story.status.toUpperCase()}.`,
          `[Success] Article generated: "${res.story.headline.slice(0, 60)}..."`
        ]);
        setLastGeneratedStory(res.story);
        onRefresh();
      }
    } catch (err: any) {
      setPipelineLog(prev => [...prev, `[Error] Ingestion failed: ${err.message}`]);
    } finally {
      setRunning(false);
    }
  };

  const processSingleRawItem = async (itemId: string) => {
    setRunning(true);
    try {
      const res = await api.processRawItem(itemId);
      if (res.success && res.story) {
        setLastGeneratedStory(res.story);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  const steps = [
    { num: 1, label: 'Feed Ingestion', desc: 'RSS polling from Top 5 channels' },
    { num: 2, label: 'Normalization', desc: 'Hash generation & clean text' },
    { num: 3, label: 'Deduplication', desc: 'Cluster ID matching & title similarity' },
    { num: 4, label: 'Gemini AI Writer', desc: 'Fact extraction & Nigerian English structure' },
    { num: 5, label: 'Publishing Gate', desc: 'Confidence threshold & sensitivity gate' }
  ];

  return (
    <div className="space-y-6">
      {/* Pipeline Visualizer Hero */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4 text-[#008751]" />
              Autonomous Ingestion Engine
            </div>
            <h2 className="text-xl font-black font-serif text-white">
              End-to-End AI News Ingestion Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Simulates the full automated cycle from raw RSS syndication to verified structured Gemini reporting.
            </p>
          </div>

          <button
            onClick={runLivePipelineDemo}
            disabled={running}
            className="px-5 py-3 bg-[#008751] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Play className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Processing Pipeline...' : 'Trigger Live AI Pipeline Test'}
          </button>
        </div>

        {/* Pipeline 5 Steps Graphic */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-6">
          {steps.map(s => {
            const isDone = activeStep > s.num;
            const isCurrent = activeStep === s.num;

            return (
              <div
                key={s.num}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/80 border-[#008751] text-emerald-300 ring-2 ring-emerald-500/30'
                    : isDone
                    ? 'bg-slate-850 border-slate-700 text-slate-200'
                    : 'bg-slate-950/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                      isCurrent
                        ? 'bg-[#008751] text-white animate-pulse'
                        : isDone
                        ? 'bg-emerald-900 text-emerald-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xs text-white mb-0.5">{s.label}</h3>
                <p className="text-[10px] text-slate-400 leading-tight">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Live Terminal Log */}
        {pipelineLog.length > 0 && (
          <div className="mt-6 bg-black/60 rounded-xl p-4 font-mono text-xs text-emerald-400 border border-slate-800 space-y-1 max-h-48 overflow-y-auto">
            {pipelineLog.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-600 select-none">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generated Story Card Preview */}
      {lastGeneratedStory && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#008751]" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-950">
                Latest AI Synthesized Article Ready
              </span>
            </div>
            <button
              onClick={() => onSelectStory(lastGeneratedStory)}
              className="px-3 py-1 bg-[#008751] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
            >
              Open Full Article Preview <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <img
              src={lastGeneratedStory.image}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full sm:w-36 h-24 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-200"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 text-[11px]">
                <span className="font-bold text-[#008751] uppercase">{lastGeneratedStory.category}</span>
                <span>•</span>
                <span className="text-slate-600 font-medium">Source: {lastGeneratedStory.primarySourceName}</span>
                <span>•</span>
                <span className="font-mono text-[#008751] font-bold">{lastGeneratedStory.confidenceScore}% Confidence</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 font-serif mb-1">
                {lastGeneratedStory.headline}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {lastGeneratedStory.summary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Raw Ingestion Queue */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-serif">
              Raw Discovered News Items in Ingestion Cache ({rawQueue.length})
            </h3>
            <p className="text-xs text-slate-500">
              Raw RSS payloads stored with SHA-256 hash before Gemini synthesis.
            </p>
          </div>
        </div>

        {rawQueue.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Queue is clear. Click "Trigger Live AI Pipeline Test" above or "Sync All Channels" in Sources tab to fetch new items.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {rawQueue.map(item => (
              <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-0.5">
                    <span className="font-bold text-slate-700">{item.sourceName}</span>
                    <span>•</span>
                    <span className="font-mono">{item.contentHash.slice(0, 10)}...</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{item.sourceTitle}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.content || item.summary}</p>
                </div>

                <button
                  onClick={() => processSingleRawItem(item.id)}
                  disabled={running}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Synthesize
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
