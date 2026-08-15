import React, { useState } from 'react';
import { NewsSource } from '../../types';
import { 
  ShieldCheck, RefreshCw, Plus, Globe, Check, AlertCircle, 
  Trash2, Edit2, ExternalLink, Radio, Play
} from 'lucide-react';
import { api } from '../../services/api';

interface SourcesManagerProps {
  sources: NewsSource[];
  onRefresh: () => void;
}

export const SourcesManager: React.FC<SourcesManagerProps> = ({ sources, onRefresh }) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSource, setNewSource] = useState<Partial<NewsSource>>({
    name: '',
    rssUrl: '',
    websiteUrl: '',
    category: 'Politics',
    priority: 'high',
    trustScore: 95,
    description: ''
  });

  const handleSyncSource = async (source: NewsSource) => {
    setSyncingId(source.id);
    setSyncResult(null);
    try {
      const res = await api.syncSource(source.id);
      setSyncResult({
        sourceName: source.name,
        ...res.result
      });
      onRefresh();
    } catch (err: any) {
      setSyncResult({ sourceName: source.name, error: err.message });
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    setSyncResult(null);
    try {
      const res = await api.syncAllSources();
      setSyncResult({ bulk: true, results: res.results });
      onRefresh();
    } catch (err: any) {
      setSyncResult({ error: err.message });
    } finally {
      setSyncingAll(false);
    }
  };

  const handleToggleActive = async (source: NewsSource) => {
    try {
      await api.updateSource(source.id, { active: !source.active });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.rssUrl) return;
    try {
      await api.addSource(newSource);
      setShowAddModal(false);
      setNewSource({
        name: '',
        rssUrl: '',
        websiteUrl: '',
        category: 'Politics',
        priority: 'high',
        trustScore: 95,
        description: ''
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#008751]" />
            Top 5 Nigerian News Channels Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time automated polling of authorized Nigerian RSS syndication endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Channel
          </button>
          <button
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="px-4 py-2 bg-[#008751] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
            {syncingAll ? 'Syncing All 5 Feeds...' : 'Sync All Channels Now'}
          </button>
        </div>
      </div>

      {/* Sync Result Banner */}
      {syncResult && (
        <div className="bg-[#0F172A] text-white p-4 rounded-xl text-xs space-y-1 border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#008751]" /> RSS Ingestion Complete
            </span>
            <button onClick={() => setSyncResult(null)} className="text-slate-400 hover:text-white cursor-pointer">
              Dismiss
            </button>
          </div>
          {syncResult.bulk ? (
            <div className="text-slate-300 text-[11px] pt-1">
              Polled all active Nigerian feeds. Discovered new items queued for deduplication and Gemini processing.
            </div>
          ) : (
            <p className="text-slate-300">
              Source: <strong className="text-white">{syncResult.sourceName}</strong> | Found: {syncResult.itemsFound || 0} items | New Discovered: {syncResult.newItemsAdded || 0} | Duplicates Filtered: {syncResult.duplicatesSkipped || 0}
              {syncResult.error && <span className="text-red-400 block mt-1">Error: {syncResult.error}</span>}
            </p>
          )}
        </div>
      )}

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map(src => (
          <div
            key={src.id}
            className={`bg-white border rounded-xl p-4 transition-all shadow-xs flex flex-col justify-between ${
              src.active ? 'border-slate-200 hover:border-[#008751]' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center font-bold text-emerald-400 text-sm">
                    {src.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900">{src.name}</h3>
                      {src.isTopFive && (
                        <span className="bg-emerald-50 text-[#008751] text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                          TOP 5
                        </span>
                      )}
                    </div>
                    <a
                      href={src.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-500 hover:text-[#008751] flex items-center gap-0.5 font-medium"
                    >
                      {src.websiteUrl} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(src)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                    src.active ? 'bg-emerald-50 text-[#008751] border-emerald-300' : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                >
                  {src.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {src.description}
              </p>

              {/* Feed URL Box */}
              <div className="bg-slate-50 rounded-lg p-2 font-mono text-[10px] text-slate-600 border border-slate-200 truncate mb-3">
                <span className="text-slate-400 select-none">RSS: </span>
                {src.rssUrl}
              </div>
            </div>

            {/* Footer Details */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>Trust: <strong className="text-[#008751] font-mono">{src.trustScore}%</strong></span>
                <span>•</span>
                <span>Type: <strong className="uppercase text-slate-700">{src.type}</strong></span>
              </div>

              <button
                onClick={() => handleSyncSource(src)}
                disabled={syncingId === src.id}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${syncingId === src.id ? 'animate-spin' : ''}`} />
                {syncingId === src.id ? 'Polling...' : 'Sync Feed'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 font-serif mb-4 pb-2 border-b border-slate-200">
              Configure New Nigerian News Source
            </h3>

            <form onSubmit={handleAddSource} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Trust, BusinessDay, TechCabal"
                  value={newSource.name}
                  onChange={e => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">RSS Feed URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.ng/feed/"
                  value={newSource.rssUrl}
                  onChange={e => setNewSource({ ...newSource, rssUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://example.ng"
                  value={newSource.websiteUrl}
                  onChange={e => setNewSource({ ...newSource, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newSource.category}
                    onChange={e => setNewSource({ ...newSource, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                  >
                    {['Politics', 'Business', 'Technology', 'Crime & Security', 'Sports', 'Education', 'Health', 'General'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trust Score (0-100)</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={newSource.trustScore}
                    onChange={e => setNewSource({ ...newSource, trustScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#008751] hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer shadow-xs"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
