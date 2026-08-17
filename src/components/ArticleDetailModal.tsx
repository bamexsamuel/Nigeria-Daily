import React, { useState } from 'react';
import { Story } from '../types';
import { 
  X, Clock, ExternalLink, ShieldCheck, Share2, 
  Check, Tag, ArrowLeft, Bookmark, CheckCircle2, Newspaper,
  ShieldAlert, Trash2, RotateCcw, AlertTriangle, CheckSquare
} from 'lucide-react';
import { AdSlot } from './AdSlot';
import { useAdminAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getSafeSourceUrl } from '../utils/sourceUrl';

interface ArticleDetailModalProps {
  story: Story;
  onClose: () => void;
  onSelectRelatedStory: (story: Story) => void;
  allStories: Story[];
  onStoryUpdated?: () => void;
  onStoryRemoved?: (storyId: string) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  story,
  onClose,
  onSelectRelatedStory,
  allStories,
  onStoryUpdated,
  onStoryRemoved
}) => {
  const { isAuthenticated, user } = useAdminAuth();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [removalReason, setRemovalReason] = useState('Not expected on this blog / Off-topic');
  const [customReason, setCustomReason] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);
  const [permanentDelete, setPermanentDelete] = useState(false);
  const [removalSuccess, setRemovalSuccess] = useState(false);

  const formatFullDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Lagos'
    }) + ' (WAT)';
  };

  const handleShare = (platform: 'whatsapp' | 'x' | 'facebook' | 'telegram' | 'copy') => {
    const url = window.location.href;
    const title = story.headline;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\nRead on Nigeria Daily Dispatch: ${url}`)}`, '_blank');
    } else if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=NigeriaNews,${story.category}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleConfirmRemoval = async () => {
    setIsRemoving(true);
    const finalReason = removalReason === 'Custom Reason' ? (customReason || 'Editorial discretion') : removalReason;

    try {
      if (permanentDelete) {
        await api.deleteStory(story.id);
      } else {
        await api.updateStory(story.id, {
          status: 'rejected',
          requiresReview: false,
          reviewReason: `Removed by ${user?.name || 'Editor'}: ${finalReason}`
        });
      }
      setRemovalSuccess(true);
      onStoryRemoved?.(story.id);
      onStoryUpdated?.();
      
      setTimeout(() => {
        setShowRemoveDialog(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to remove story', err);
      // Even on network error, ensure local state removes it
      onStoryRemoved?.(story.id);
      onClose();
    } finally {
      setIsRemoving(false);
    }
  };

  const safePrimaryUrl = getSafeSourceUrl(story);

  const related = allStories
    .filter(s => s.id !== story.id && s.status === 'published' && (s.category === story.category || s.primarySourceName === story.primarySourceName))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6">
      <div 
        id="article-detail-container"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200/90"
      >
        {/* Top Action Sticky Bar */}
        <div className="sticky top-0 z-20 bg-white/98 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008751] transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Wire</span>
          </button>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                id="modal-editorial-remove-btn"
                onClick={() => setShowRemoveDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#991B1B] font-bold text-xs rounded-lg border border-red-200 transition-all cursor-pointer shadow-xs"
                title="Remove this post from public live blog"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from Blog</span>
              </button>
            )}

            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                saved ? 'bg-emerald-50 text-[#008751]' : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Bookmark story"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleShare('copy')}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
              title="Copy share link"
            >
              {copied ? <Check className="w-4 h-4 text-[#008751]" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[85vh]">
          {/* Category & Verified Live Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-[#0F172A] text-white font-mono text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {story.category}
            </span>

            {story.isBreaking && (
              <span className="bg-[#991B1B] text-white text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider animate-pulse">
                Breaking News
              </span>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-auto">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatFullDate(story.publishedAt)}</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 font-serif leading-tight mb-4">
            {story.headline}
          </h1>

          {/* Executive Summary Callout */}
          <div className="bg-slate-50 border-l-4 border-[#008751] p-4.5 rounded-r-xl mb-6 text-slate-800 font-medium text-base leading-relaxed font-sans">
            {story.summary}
          </div>

          {/* Byline & Verified Newsroom Attribution Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-100/80 rounded-xl border border-slate-200/90 mb-6 text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs shadow-xs border border-slate-700">
                <Newspaper className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-slate-950">National Editorial Desk</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified Reporting Wire • Direct Press Ingestion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono text-[#008751] bg-emerald-50 px-3 py-1 rounded-md border border-emerald-300 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008751]" />
                <span>{story.confidenceScore}%</span> Fact Corroborated
              </div>
              <span className="font-semibold text-slate-600">{story.readingTimeMinutes} min read</span>
            </div>
          </div>

          {/* MANDATORY SOURCE ATTRIBUTION CALLOUT BANNER (SAFE URL TO PREVENT 404) */}
          <div 
            id="mandatory-source-attribution" 
            className="bg-emerald-50/95 border border-emerald-300 rounded-xl p-4 mb-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#008751] shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-xs text-emerald-950 font-bold">
                    Original Source Reporting: <strong className="text-[#008751] font-black">{story.primarySourceName}</strong>
                  </p>
                  {story.sources && story.sources.length > 1 && (
                    <p className="text-[11px] text-emerald-850 font-medium mt-0.5">
                      Corroborated across: {story.sources.map(s => s.sourceName).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <a
                href={safePrimaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#008751] hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer shrink-0"
              >
                <span>Read on {story.primarySourceName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden mb-6 bg-slate-900 shadow-md">
            <img
              src={story.image}
              alt={story.headline}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {story.imageCaption && (
              <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-[11px]">
                <span>{story.imageCaption}</span>
                {story.imageCredit && <span className="opacity-75 ml-2">• Photo: {story.imageCredit}</span>}
              </div>
            )}
          </div>

          {/* Key Facts / Intelligence Bullets */}
          {story.keyPoints && story.keyPoints.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#008751]"></span>
                Essential Dispatch Intelligence
              </h3>
              <ul className="space-y-2.5">
                {story.keyPoints.map((kp, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-[#008751] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Structured Journalistic Breakdown */}
          {story.whatHappened && (
            <div className="space-y-6 mb-8 text-slate-800">
              <div className="border-b border-slate-200 pb-5">
                <h3 className="text-sm font-black font-serif uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0F172A]"></span>
                  What Happened
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 font-sans">
                  {story.whatHappened}
                </p>
              </div>

              {story.mainStory && (
                <div className="border-b border-slate-200 pb-5">
                  <h3 className="text-sm font-black font-serif uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#008751]"></span>
                    Full Narrative Report
                  </h3>
                  <div className="text-sm leading-relaxed text-slate-700 font-sans space-y-3 whitespace-pre-line">
                    {story.mainStory}
                  </div>
                </div>
              )}

              {story.background && (
                <div className="border-b border-slate-200 pb-5">
                  <h3 className="text-sm font-black font-serif uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-600"></span>
                    Background Context
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700 font-sans">
                    {story.background}
                  </p>
                </div>
              )}

              {story.whatHappensNext && (
                <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200">
                  <h3 className="text-sm font-black font-serif uppercase tracking-wider text-emerald-950 mb-1 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#008751]"></span>
                    What Happens Next
                  </h3>
                  <p className="text-sm leading-relaxed text-emerald-900 font-sans">
                    {story.whatHappensNext}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* In-Article Advertisement Slot */}
          <div className="my-8">
            <AdSlot type="in-article" />
          </div>

          {/* Verified Corroborating Sources Links */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-8">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Verified Direct Source References:
            </h4>
            <div className="space-y-2">
              {story.sources && story.sources.length > 0 ? (
                story.sources.map((src, i) => {
                  const safeSrcUrl = getSafeSourceUrl({ primarySourceUrl: src.sourceUrl, primarySourceName: src.sourceName });
                  return (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 bg-white rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800">{src.sourceName}</span>
                      <a
                        href={safeSrcUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#008751] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>View Source Report</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-white rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-800">{story.primarySourceName}</span>
                  <a
                    href={safePrimaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#008751] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>View Source Report</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Social Share Bar */}
          <div className="border-t border-b border-slate-200 py-4 mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Share this Verified Report:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare('whatsapp')}
                className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('x')}
                className="px-3 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                X (Twitter)
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="px-3 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-slate-300"
              >
                {copied ? 'Copied Link!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Related Stories */}
          {related.length > 0 && (
            <div>
              <h3 className="text-sm font-black font-serif uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#008751]"></span>
                Related News Wire Reports
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(r => (
                  <div
                    key={r.id}
                    onClick={() => onSelectRelatedStory(r)}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-bold font-mono text-[#008751] uppercase">
                      {r.category}
                    </span>
                    <h4 className="text-xs font-bold font-serif text-slate-900 group-hover:text-[#008751] line-clamp-2 mt-1 mb-2">
                      {r.headline}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      via {r.primarySourceName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Takedown Confirmation Modal */}
      {showRemoveDialog && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#991B1B] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-sm font-bold font-serif text-white">
                  Remove Article from Live Blog
                </h3>
              </div>
              <button
                onClick={() => setShowRemoveDialog(false)}
                className="text-red-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {removalSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-emerald-900 font-bold">
                  <CheckCircle2 className="w-8 h-8 text-[#008751] mx-auto mb-2" />
                  Article successfully removed from public live blog.
                </div>
              ) : (
                <>
                  <p className="text-slate-600 leading-relaxed">
                    This will immediately take down <strong>"{story.headline}"</strong> from the public live website and archive it with your removal reason.
                  </p>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Removal Reason:
                    </label>
                    <div className="space-y-2">
                      {[
                        'Not expected on this blog / Off-topic',
                        'Unverified or inaccurate claims',
                        'Duplicate or redundant coverage',
                        'Editorial discretion / Retraction',
                        'Sensationalized or uncorroborated headline',
                        'Custom Reason'
                      ].map(r => (
                        <label
                          key={r}
                          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            removalReason === r
                              ? 'border-red-600 bg-red-50 text-red-950 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="removalReason"
                            checked={removalReason === r}
                            onChange={() => setRemovalReason(r)}
                          />
                          <span>{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {removalReason === 'Custom Reason' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Custom Editorial Note:
                      </label>
                      <textarea
                        rows={2}
                        value={customReason}
                        onChange={e => setCustomReason(e.target.value)}
                        placeholder="Enter explanation for takedown..."
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2 pt-2 border-t border-slate-200 cursor-pointer text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={permanentDelete}
                      onChange={e => setPermanentDelete(e.target.checked)}
                      className="rounded text-red-600"
                    />
                    <span>Delete permanently (purge from all database records)</span>
                  </label>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowRemoveDialog(false)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={handleConfirmRemoval}
                      className="px-4 py-2 bg-[#991B1B] hover:bg-red-800 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isRemoving ? 'Removing from live blog...' : 'Confirm Removal'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
