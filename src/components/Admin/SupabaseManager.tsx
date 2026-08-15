import React, { useState } from 'react';
import { 
  Database, Cloud, Check, Copy, ExternalLink, RefreshCw, 
  ShieldCheck, AlertCircle, Layers, Zap, Server 
} from 'lucide-react';
import { isSupabaseConfigured, getSupabaseSchemaSql, syncStoryToSupabase } from '../../services/supabase';
import { Story } from '../../types';

interface SupabaseManagerProps {
  stories: Story[];
}

export const SupabaseManager: React.FC<SupabaseManagerProps> = ({ stories }) => {
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncCount, setSyncCount] = useState<number | null>(null);

  const configured = isSupabaseConfigured();
  const schemaSql = getSupabaseSchemaSql();

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSyncAllToSupabase = async () => {
    if (!configured) return;
    setSyncing(true);
    let successCount = 0;
    try {
      for (const story of stories) {
        const ok = await syncStoryToSupabase(story);
        if (ok) successCount++;
      }
      setSyncCount(successCount);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Architecture Status Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black font-serif text-slate-900">
                  Supabase & Vercel Production Backend
                </h2>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    configured
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  {configured ? 'Supabase Connected' : 'Local Fast Memory / Ready to Connect'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                PostgreSQL database layer, Row-Level Security (RLS), and Vercel serverless compatibility.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              Open Supabase Dashboard
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 3 Steps to Deploy on Vercel & Supabase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#008751] block mb-1">
              Step 1: Create Supabase Tables
            </span>
            <p className="text-xs text-slate-700 font-semibold mb-2">
              Run the SQL Schema in Supabase SQL Editor.
            </p>
            <button
              onClick={handleCopySchema}
              className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#008751]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'SQL Copied!' : 'Copy Migration SQL'}
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#008751] block mb-1">
              Step 2: Set Environment Secrets
            </span>
            <p className="text-xs text-slate-700 font-semibold mb-2">
              Add to Vercel / Environment settings:
            </p>
            <div className="font-mono text-[10px] bg-slate-900 text-emerald-300 p-2 rounded-md space-y-0.5">
              <div>VITE_SUPABASE_URL</div>
              <div>VITE_SUPABASE_ANON_KEY</div>
              <div>GROQ_API_KEY</div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#008751] block mb-1">
              Step 3: Deploy on Vercel
            </span>
            <p className="text-xs text-slate-700 font-semibold mb-2">
              vercel.json is pre-configured for instant zero-config deployments.
            </p>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              Import Repo to Vercel
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sync Local Stories to Supabase */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-900">
              Bulk Sync Stories & Articles to Supabase
            </p>
            <p className="text-[11px] text-slate-500">
              Push {stories.length} verified Nigerian news articles to your Supabase `stories` table.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {syncCount !== null && (
              <span className="text-xs font-bold text-[#008751] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300">
                Synced {syncCount} articles!
              </span>
            )}
            <button
              onClick={handleSyncAllToSupabase}
              disabled={!configured || syncing}
              className="px-4 py-2 bg-[#008751] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync to Supabase'}
            </button>
          </div>
        </div>
      </div>

      {/* SQL Migration Script Viewer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-mono text-white">
              supabase_schema.sql (PostgreSQL)
            </h3>
          </div>
          <button
            onClick={handleCopySchema}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-md flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy SQL'}
          </button>
        </div>

        <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto p-3 bg-slate-950 rounded-xl max-h-72 leading-relaxed border border-slate-800 scrollbar-thin">
          {schemaSql}
        </pre>
      </div>
    </div>
  );
};
