import React, { useState } from 'react';
import { Story, StoryStatus } from '../../types';
import { 
  Check, X, Eye, Edit3, Trash2, ShieldCheck, Sparkles, 
  AlertTriangle, Filter, Search, ExternalLink, RefreshCw 
} from 'lucide-react';
import { api } from '../../services/api';

interface ArticlesManagerProps {
  stories: Story[];
  onRefresh: () => void;
  onSelectStory: (story: Story) => void;
}

export const ArticlesManager: React.FC<ArticlesManagerProps> = ({
  stories,
  onRefresh,
  onSelectStory
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = stories.filter(s => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        s.headline.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.primarySourceName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: StoryStatus) => {
    try {
      await api.updateStoryStatus(id, newStatus);
      onRefresh();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      await api.deleteStory(id);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete story', err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    setSaving(true);
    try {
      await api.updateStory(editingStory.id, editingStory);
      setEditingStory(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to save story edits', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search headline, source, category..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#008751]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            onClick={onRefresh}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['all', 'published', 'review', 'draft', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Review Queue Alerts if any */}
      {stories.some(s => s.status === 'review' || s.requiresReview) && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Articles Awaiting Human Editorial Verification ({stories.filter(s => s.status === 'review' || s.requiresReview).length})
              </p>
              <p className="text-[11px] text-amber-800">
                These stories were held due to sensitive topic flags or confidence thresholds under rules in PRD Section 15.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterStatus('review')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-xs"
          >
            Review Queue
          </button>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Headline & Summary</th>
                <th className="py-3 px-3">Source Channel</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">AI Fact Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No articles found matching the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map(story => (
                  <tr key={story.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={story.image}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 font-serif leading-snug line-clamp-2">
                            {story.headline}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {story.summary}
                          </p>
                          {story.requiresReview && story.reviewReason && (
                            <span className="inline-block mt-1 text-[10px] text-amber-800 bg-amber-100 font-medium px-1.5 py-0.2 rounded border border-amber-200">
                              Flag: {story.reviewReason}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#008751]" />
                        {story.primarySourceName}
                      </div>
                      <a
                        href={story.primarySourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[#008751] hover:underline flex items-center gap-0.5 mt-0.5 font-medium"
                      >
                        Original report <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {story.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-mono text-[#008751] font-bold">
                        <Sparkles className="w-3 h-3 text-[#008751]" />
                        {story.confidenceScore}%
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          story.status === 'published'
                            ? 'bg-emerald-50 text-[#008751] border border-emerald-300'
                            : story.status === 'review'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : story.status === 'draft'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {story.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStory(story)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md cursor-pointer"
                          title="Preview Full Article"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setEditingStory({ ...story })}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {story.status !== 'published' ? (
                          <button
                            onClick={() => handleStatusChange(story.id, 'published')}
                            className="p-1.5 bg-[#008751] hover:bg-emerald-700 text-white rounded-md flex items-center gap-1 text-[11px] font-bold px-2 cursor-pointer shadow-xs"
                            title="Approve & Publish"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(story.id, 'draft')}
                            className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-[11px] font-medium px-2 cursor-pointer border border-amber-200"
                            title="Unpublish to Draft"
                          >
                            Unpublish
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(story.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Story Modal */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 font-serif">
                Edit Synthesized News Story
              </h3>
              <button onClick={() => setEditingStory(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={editingStory.headline}
                  onChange={e => setEditingStory({ ...editingStory, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-serif focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Executive Summary</label>
                <textarea
                  rows={3}
                  value={editingStory.summary}
                  onChange={e => setEditingStory({ ...editingStory, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingStory.category}
                    onChange={e => setEditingStory({ ...editingStory, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                  >
                    {['Politics', 'Business', 'Technology', 'Crime & Security', 'Sports', 'Education', 'Health', 'World', 'General'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Publication Status</label>
                  <select
                    value={editingStory.status}
                    onChange={e => setEditingStory({ ...editingStory, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                  >
                    <option value="published">Published</option>
                    <option value="review">Under Review</option>
                    <option value="draft">Draft</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 block">Featured Image</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-700" /> AI Image Presets:
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingStory({ 
                        ...editingStory, 
                        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
                        imageCaption: 'Central Bank of Nigeria and monetary financial district.',
                        imageCredit: 'Editorial AI Photo Bureau'
                      })}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer font-medium"
                    >
                      Economy / CBN
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStory({ 
                        ...editingStory, 
                        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
                        imageCaption: 'Modern Lagos AI and high-performance computing facility.',
                        imageCredit: 'Editorial AI Photo Bureau'
                      })}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer font-medium"
                    >
                      Tech / AI
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStory({ 
                        ...editingStory, 
                        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
                        imageCaption: 'Godswill Akpabio International Stadium in Uyo.',
                        imageCredit: 'Vanguard Sports Bureau'
                      })}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer font-medium"
                    >
                      Sports
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingStory.image}
                    onChange={e => setEditingStory({ ...editingStory, image: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px] focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                  />
                  {editingStory.image && (
                    <div className="w-12 h-9 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                      <img 
                        src={editingStory.image} 
                        alt="Preview" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
              </div>


              <div>
                <label className="font-bold text-slate-700 block mb-1">What Happened?</label>
                <textarea
                  rows={3}
                  value={editingStory.whatHappened}
                  onChange={e => setEditingStory({ ...editingStory, whatHappened: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Main Story Body</label>
                <textarea
                  rows={5}
                  value={editingStory.mainStory}
                  onChange={e => setEditingStory({ ...editingStory, mainStory: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#008751] hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer shadow-xs"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
