import React, { useState } from 'react';
import { SystemSettings } from '../../types';
import { Sparkles, Save, ShieldCheck, Clock, Check } from 'lucide-react';
import { api } from '../../services/api';

interface SettingsViewProps {
  settings: SystemSettings;
  onRefresh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-3xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Editorial AI & Automation Settings
          </h2>
          <p className="text-xs text-slate-500">
            Configure Gemini model parameters, confidence thresholds, and publishing automation rules.
          </p>
        </div>
        {saved && (
          <span className="text-xs text-[#008751] bg-emerald-50 border border-emerald-300 font-bold px-3 py-1 rounded-lg flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-[#008751]" /> Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: AI Model Configuration */}
        <div className="space-y-3">
          <h3 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#008751]" />
            Gemini AI Model Configuration
          </h3>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Active AI Model</label>
            <select
              value={formData.geminiModel}
              onChange={e => setFormData({ ...formData, geminiModel: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
            >
              <option value="gemini-3.7-flash">gemini-3.7-flash (Default - Fast, Accurate Journalism)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Reasoning & Synthesis)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Configured dynamically in server-side AI controller. Secrets handled via Cloud environment.
            </p>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Editorial Style Prompt</label>
            <textarea
              rows={2}
              value={formData.editorialStyle}
              onChange={e => setFormData({ ...formData, editorialStyle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Section 2: Automation & Publishing Gates */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <h3 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#008751]" />
            Publishing Gates & Quality Controls
          </h3>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-900">Auto-Publish Qualified Articles</p>
              <p className="text-[11px] text-slate-500">
                Articles with confidence above threshold and no sensitive flags publish automatically.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoPublishEnabled}
              onChange={e => setFormData({ ...formData, autoPublishEnabled: e.target.checked })}
              className="w-4 h-4 text-[#008751] rounded focus:ring-[#008751] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Minimum Confidence Threshold ({formData.minConfidenceThreshold}%)
              </label>
              <input
                type="range"
                min={60}
                max={98}
                value={formData.minConfidenceThreshold}
                onChange={e => setFormData({ ...formData, minConfidenceThreshold: Number(e.target.value) })}
                className="w-full accent-[#008751]"
              />
              <p className="text-[10px] text-slate-400">
                Scores below this automatically enter the Human Review Queue.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Sensitive Topic Review Threshold ({formData.sensitiveReviewThreshold}%)
              </label>
              <input
                type="range"
                min={80}
                max={99}
                value={formData.sensitiveReviewThreshold}
                onChange={e => setFormData({ ...formData, sensitiveReviewThreshold: Number(e.target.value) })}
                className="w-full accent-[#008751]"
              />
              <p className="text-[10px] text-slate-400">
                Stricter bar applied to deaths, crime, trials, and election stories.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Timezone & Polling */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h3 className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#008751]" />
            Timezone & Ingestion Schedule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Newsroom Timezone</label>
              <input
                type="text"
                disabled
                value={formData.watTimezone}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Feed Polling Frequency (Minutes)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={formData.pollingFrequencyMinutes}
                onChange={e => setFormData({ ...formData, pollingFrequencyMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#008751] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Settings...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};
