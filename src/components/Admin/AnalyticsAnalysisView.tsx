import React, { useState, useMemo } from 'react';
import { Story, NewsSource, NewsroomStats } from '../../types';
import { 
  BarChart3, ShieldCheck, AlertTriangle, Trash2, Eye, 
  RotateCcw, CheckCircle2, TrendingUp, Filter, Search, 
  Sparkles, ExternalLink, Flame, ShieldAlert, ArrowRight, Check, X
} from 'lucide-react';
import { api } from '../../services/api';

interface AnalyticsAnalysisViewProps {
  stories: Story[];
  sources: NewsSource[];
  stats: NewsroomStats;
  onRefresh: () => void;
  onSelectStory: (story: Story) => void;
}

export const AnalyticsAnalysisView: React.FC<AnalyticsAnalysisViewProps> = ({
  stories,
  sources,
  stats,
  onRefresh,
  onSelectStory
}) => {
  const [selectedRemovalReason, setSelectedRemovalReason] = useState<string>('Not expected / Off-topic');
  const [customReason, setCustomReason] = useState('');
  const [targetStoryToRemove, setTargetStoryToRemove] = useState<Story | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Analysis Metrics
  const totalCount = stories.length;
  const publishedStories = useMemo(() => stories.filter(s => s.status === 'published'), [stories]);
  const reviewStories = useMemo(() => stories.filter(s => s.status === 'review' || s.requiresReview), [stories]);
  const draftStories = useMemo(() => stories.filter(s => s.status === 'draft'), [stories]);
  const removedStories = useMemo(() => stories.filter(s => s.status === 'rejected'), [stories]);

  // Total views
  const totalViews = useMemo(() => {
    return stories.reduce((sum, s) => sum + (s.views || 0), 0);
  }, [stories]);

  // Average confidence score
  const avgConfidence = useMemo(() => {
    if (stories.length === 0) return 96;
    const sum = stories.reduce((acc, s) => acc + (s.confidenceScore || 95), 0);
    return Math.round(sum / stories.length);
  }, [stories]);

  // Sources breakdown
  const sourceStats = useMemo(() => {
    return sources.map(src => {
      const srcStories = stories.filter(s => 
        s.sources?.some(orig => orig.sourceId === src.id) || 
        s.primarySourceName.toLowerCase().includes(src.name.toLowerCase())
      );
      const published = srcStories.filter(s => s.status === 'published').length;
      const rejected = srcStories.filter(s => s.status === 'rejected').length;
      const avgScore = srcStories.length > 0
        ? Math.round(srcStories.reduce((acc, s) => acc + s.confidenceScore, 0) / srcStories.length)
        : src.trustScore;

      return {
        source: src,
        total: srcStories.length,
        published,
        rejected,
        avgScore
      };
    });
  }, [sources, stories]);

  // High-risk or potentially unexpected items scanner
  const flaggedUnexpectedStories = useMemo(() => {
    return stories.filter(s => {
      // Stories with confidence < 92%, or flagged reviewReason, or breaking without verification
      return (
        s.status === 'published' && (
          s.confidenceScore < 93 ||
          s.requiresReview ||
          s.headline.toLowerCase().includes('alleged') ||
          s.headline.toLowerCase().includes('rumor') ||
          s.headline.toLowerCase().includes('unconfirmed') ||
          s.keyPoints.length < 2
        )
      );
    });
  }, [stories]);

  // Fast Remove from Blog Handler
  const handleConfirmRemoval = async () => {
    if (!targetStoryToRemove) return;

    const reason = selectedRemovalReason === 'Custom Reason' ? (customReason || 'Editorial rejection') : selectedRemovalReason;

    try {
      await api.updateStory(targetStoryToRemove.id, {
        status: 'rejected',
        requiresReview: false,
        reviewReason: `Removed by Editor: ${reason}`
      });

      setActionSuccessMessage(`Successfully removed "${targetStoryToRemove.headline.slice(0, 45)}..." from public blog.`);
      setTargetStoryToRemove(null);
      setCustomReason('');
      onRefresh();

      setTimeout(() => {
        setActionSuccessMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error('Failed to remove story:', err);
    }
  };

  // Restore Removed Story back to published
  const handleRestoreStory = async (storyId: string) => {
    try {
      await api.updateStoryStatus(storyId, 'published');
      setActionSuccessMessage(`Restored article back to Live Blog.`);
      onRefresh();

      setTimeout(() => {
        setActionSuccessMessage(null);
      }, 3500);
    } catch (err) {
      console.error(err);
    }
  };

  // Permanently delete story
  const handlePermanentDelete = async (storyId: string) => {
    if (!window.confirm('Permanently purge this story from database?')) return;
    try {
      await api.deleteStory(storyId);
      setActionSuccessMessage(`Article permanently deleted.`);
      onRefresh();

      setTimeout(() => {
        setActionSuccessMessage(null);
      }, 3500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Feedback */}
      {actionSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-[#008751] px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Section: Analysis Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Ingested
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-serif">
              {totalCount}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
              All Time
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Dispatches from Top 5 feeds</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Live on Public Blog
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#008751] font-serif">
              {publishedStories.length}
            </span>
            <span className="text-[10px] text-[#008751] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {totalCount > 0 ? Math.round((publishedStories.length / totalCount) * 100) : 0}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active reader audience</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Review Queue
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 font-serif">
              {reviewStories.length}
            </span>
            {reviewStories.length > 0 && (
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                Action Req.
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Held for editorial review</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Removed / Rejected
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-red-600 font-serif">
              {removedStories.length}
            </span>
            <span className="text-[10px] text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
              Taken Down
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Blocked from public view</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Avg AI Fact Score
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#008751] font-serif">
              {avgConfidence}%
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              High Trust
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">{totalViews.toLocaleString()} reader views</p>
        </div>
      </div>

      {/* Section 2: Flagged / Potential Unexpected News Scanner */}
      <div className="bg-white border border-amber-300 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                Live Post Quality Scanner & Quick Triage
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {flaggedUnexpectedStories.length} Attention items
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Identifies published dispatches with sensitivity tags, unconfirmed keywords, or lower verification scores for fast removal.
              </p>
            </div>
          </div>
        </div>

        {flaggedUnexpectedStories.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#008751] mb-2" />
            <p className="font-bold text-slate-800">All live blog posts meet high confidence standards (93%+).</p>
            <p className="text-slate-400 mt-1">No anomalous or unexpected news patterns detected.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-2">
            {flaggedUnexpectedStories.map(story => (
              <div key={story.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img
                    src={story.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {story.primarySourceName}
                      </span>
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        Score: {story.confidenceScore}%
                      </span>
                      {story.reviewReason && (
                        <span className="text-[10px] text-red-700 bg-red-50 font-medium px-1.5 py-0.2 rounded border border-red-200 truncate">
                          {story.reviewReason}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 font-serif leading-snug truncate">
                      {story.headline}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {story.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onSelectStory(story)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect
                  </button>
                  <button
                    onClick={() => setTargetStoryToRemove(story)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove From Blog
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Outlet Analysis Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 font-serif mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#008751]" />
          Top 5 Nigerian Outlets Ingestion & Publication Analysis
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3">Press Channel</th>
                <th className="py-3 px-3">Category Focus</th>
                <th className="py-3 px-3 text-center">Ingested</th>
                <th className="py-3 px-3 text-center">Published on Blog</th>
                <th className="py-3 px-3 text-center">Removed / Rejected</th>
                <th className="py-3 px-3 text-center">Avg Accuracy</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sourceStats.map(st => (
                <tr key={st.source.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#008751]"></span>
                      {st.source.name}
                    </div>
                    <a
                      href={st.source.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-slate-400 hover:text-emerald-700 flex items-center gap-0.5 mt-0.5"
                    >
                      {st.source.websiteUrl} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                      {st.source.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                    {st.total}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="bg-emerald-50 text-[#008751] font-bold px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                      {st.published}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                      st.rejected > 0 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'text-slate-400'
                    }`}>
                      {st.rejected}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[#008751] font-mono font-bold">
                      {st.avgScore}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      ACTIVE WIRE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Removed / Rejected Articles Audit & Restore Log */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              Removed & Blocked Posts Audit Log ({removedStories.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Articles that have been taken down from the public blog. You can inspect reasons, restore them back to the live blog, or permanently delete them.
            </p>
          </div>
        </div>

        {removedStories.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No articles have been removed from the blog post feed yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-3">
            {removedStories.map(story => (
              <div key={story.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-1.5 py-0.2 rounded">
                        Removed
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Source: <strong>{story.primarySourceName}</strong>
                      </span>
                      {story.reviewReason && (
                        <span className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.2 rounded font-medium">
                          {story.reviewReason}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 font-serif leading-snug">
                      {story.headline}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {story.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleRestoreStory(story.id)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#008751] border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Publish back to Live Blog"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore to Blog
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(story.id)}
                    className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg cursor-pointer"
                    title="Permanently Purge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Removing News From Blog */}
      {targetStoryToRemove && (
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
                onClick={() => setTargetStoryToRemove(null)}
                className="text-red-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Target Headline</p>
                <h4 className="text-xs font-bold text-slate-900 font-serif mt-0.5">
                  {targetStoryToRemove.headline}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Source: <strong>{targetStoryToRemove.primarySourceName}</strong> • Category: {targetStoryToRemove.category}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Removal / Rejection Reason:
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
                        selectedRemovalReason === reason
                          ? 'border-[#991B1B] bg-red-50/60 text-red-950 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="removalReason"
                        checked={selectedRemovalReason === reason}
                        onChange={() => setSelectedRemovalReason(reason)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedRemovalReason === 'Custom Reason' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specify Custom Editorial Reason:
                  </label>
                  <textarea
                    rows={2}
                    value={customReason}
                    onChange={e => setCustomReason(e.target.value)}
                    placeholder="Enter reason for removing dispatch..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTargetStoryToRemove(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemoval}
                  className="px-4 py-2 bg-[#991B1B] hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Confirm & Take Down Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
