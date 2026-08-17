import React, { useState } from 'react';
import { Story, StoryStatus } from '../../types';
import { 
  Check, X, Eye, Edit3, Trash2, ShieldCheck, Sparkles, 
  AlertTriangle, Filter, Search, ExternalLink, RefreshCw,
  RotateCcw, ShieldAlert, CheckSquare, Square
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
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
  
  // Removal reason modal state
  const [storyToRemove, setStoryToRemove] = useState<Story | null>(null);
  const [removalReason, setRemovalReason] = useState<string>('Not expected / Off-topic on blog');
  const [customRemovalReason, setCustomRemovalReason] = useState('');

  const filtered = stories.filter(s => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        s.headline.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.primarySourceName.toLowerCase().includes(q) ||
        (s.reviewReason && s.reviewReason.toLowerCase().includes(q))
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

  const handleConfirmRemoval = async () => {
    if (!storyToRemove) return;
    const finalReason = removalReason === 'Custom Reason' ? (customRemovalReason || 'Editorial rejection') : removalReason;

    try {
      await api.updateStory(storyToRemove.id, {
        status: 'rejected',
        requiresReview: false,
        reviewReason: `Removed: ${finalReason}`
      });
      setStoryToRemove(null);
      setCustomRemovalReason('');
      onRefresh();
    } catch (err) {
      console.error('Failed to remove story', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      await api.deleteStory(id);
      setSelectedStoryIds(prev => prev.filter(i => i !== id));
      onRefresh();
    } catch (err) {
      console.error('Failed to delete story', err);
    }
  };

  // Bulk operations
  const handleToggleSelect = (id: string) => {
    setSelectedStoryIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedStoryIds.length === filtered.length) {
      setSelectedStoryIds([]);
    } else {
      setSelectedStoryIds(filtered.map(s => s.id));
    }
  };

  const handleBulkRemoveFromBlog = async () => {
    if (!window.confirm(`Take down ${selectedStoryIds.length} selected articles from the public blog?`)) return;
    try {
      for (const id of selectedStoryIds) {
        await api.updateStory(id, {
          status: 'rejected',
          reviewReason: 'Batch removed by Editor: Unexpected / Off-topic content'
        });
      }
      setSelectedStoryIds([]);
      onRefresh();
    } catch (err) {
      console.error('Bulk removal error:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Permanently delete ${selectedStoryIds.length} selected articles from database?`)) return;
    try {
      for (const id of selectedStoryIds) {
        await api.deleteStory(id);
      }
      setSelectedStoryIds([]);
      onRefresh();
    } catch (err) {
      console.error('Bulk delete error:', err);
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
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
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
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'published', label: 'Live Blog' },
            { id: 'review', label: 'Review Queue' },
            { id: 'draft', label: 'Draft' },
            { id: 'rejected', label: 'Removed / Blocked' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === st.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar if items selected */}
      {selectedStoryIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-[#008751] text-white px-2 py-0.5 rounded font-bold">
              {selectedStoryIds.length} Selected
            </span>
            <span>Batch moderation options for highlighted posts</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkRemoveFromBlog}
              className="px-3 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Remove from Live Blog
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button
              onClick={() => setSelectedStoryIds([])}
              className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
                These stories were held due to sensitive topic flags or confidence thresholds.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterStatus('review')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-xs"
          >
            Inspect Queue
          </button>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <button 
                    onClick={handleSelectAllFiltered}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Select All Filtered"
                  >
                    {selectedStoryIds.length > 0 && selectedStoryIds.length === filtered.length ? (
                      <CheckSquare className="w-4 h-4 text-[#008751]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Headline & Summary</th>
                <th className="py-3 px-3">Source Channel</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">AI Fact Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No articles found matching the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map(story => {
                  const isSelected = selectedStoryIds.includes(story.id);

                  return (
                    <tr 
                      key={story.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleSelect(story.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#008751]" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>
                      </td>

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
                            {story.reviewReason && (
                              <span className={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.2 rounded border ${
                                story.status === 'rejected'
                                  ? 'text-red-800 bg-red-100 border-red-200'
                                  : 'text-amber-800 bg-amber-100 border-amber-200'
                              }`}>
                                {story.reviewReason}
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
                          {story.status === 'rejected' ? 'REMOVED' : story.status}
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

                          {story.status === 'published' ? (
                            <button
                              onClick={() => setStoryToRemove(story)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md flex items-center gap-1 text-[11px] font-bold px-2.5 cursor-pointer shadow-xs"
                              title="Remove from Public Blog"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Remove
                            </button>
                          ) : story.status === 'rejected' ? (
                            <button
                              onClick={() => handleStatusChange(story.id, 'published')}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#008751] border border-emerald-300 rounded-md flex items-center gap-1 text-[11px] font-bold px-2 cursor-pointer"
                              title="Restore to Public Blog"
                            >
                              <RotateCcw className="w-3 h-3" /> Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(story.id, 'published')}
                              className="p-1.5 bg-[#008751] hover:bg-emerald-700 text-white rounded-md flex items-center gap-1 text-[11px] font-bold px-2 cursor-pointer shadow-xs"
                              title="Approve & Publish"
                            >
                              <Check className="w-3 h-3" /> Publish
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(story.id)}
                            className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-md cursor-pointer"
                            title="Permanently Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Removing News From Blog Post */}
      {storyToRemove && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#991B1B] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-base font-bold font-serif text-white">
                  Remove Article from Live Blog
                </h3>
              </div>
              <button
                onClick={() => setStoryToRemove(null)}
                className="text-red-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Target Headline</p>
                <h4 className="text-xs font-bold text-slate-900 font-serif mt-0.5">
                  {storyToRemove.headline}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Source: <strong>{storyToRemove.primarySourceName}</strong> • Category: {storyToRemove.category}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Removal Reason:
                </label>
                <div className="space-y-2">
                  {[
                    'Not expected on this blog post / Off-topic',
                    'Unverified or misleading claims',
                    'Duplicate or redundant coverage',
                    'Editorial discretion / Retraction',
                    'Sensationalized or uncorroborated headline',
                    'Custom Reason'
                  ].map(reason => (
                    <label
                      key={reason}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-colors ${
                        removalReason === reason
                          ? 'border-[#991B1B] bg-red-50/60 text-red-950 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="removalReason"
                        checked={removalReason === reason}
                        onChange={() => setRemovalReason(reason)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {removalReason === 'Custom Reason' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Custom Reason:
                  </label>
                  <textarea
                    rows={2}
                    value={customRemovalReason}
                    onChange={e => setCustomRemovalReason(e.target.value)}
                    placeholder="Enter reason for removing dispatch..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStoryToRemove(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemoval}
                  className="px-4 py-2 bg-[#991B1B] hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Remove from Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  value={editingStory.headline}
                  onChange={e => setEditingStory({ ...editingStory, headline: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-serif font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Executive Summary</label>
                <textarea
                  rows={2}
                  value={editingStory.summary}
                  onChange={e => setEditingStory({ ...editingStory, summary: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingStory.category}
                    onChange={e => setEditingStory({ ...editingStory, category: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={editingStory.status}
                    onChange={e => setEditingStory({ ...editingStory, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="published">Published (Live Blog)</option>
                    <option value="review">Review Queue</option>
                    <option value="draft">Draft</option>
                    <option value="rejected">Removed / Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Main Article Body</label>
                <textarea
                  rows={6}
                  value={editingStory.article}
                  onChange={e => setEditingStory({ ...editingStory, article: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#008751] hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
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
