import React, { useState } from 'react';
import { Story } from '../types';
import { 
  X, Clock, ExternalLink, ShieldCheck, Share2, 
  Check, Tag, ArrowLeft, Bookmark, CheckCircle2, Newspaper,
  ShieldAlert, Trash2, RotateCcw
} from 'lucide-react';
import { AdSlot } from './AdSlot';
import { useAdminAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ArticleDetailModalProps {
  story: Story;
  onClose: () => void;
  onSelectRelatedStory: (story: Story) => void;
  allStories: Story[];
  onStoryUpdated?: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  story,
  onClose,
  onSelectRelatedStory,
  allStories,
  onStoryUpdated
}) => {
  const { isAuthenticated, user } = useAdminAuth();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [removalReason, setRemovalReason] = useState('Not expected on this blog / Off-topic');
  const [customReason, setCustomReason] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);

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
      await api.updateStory(story.id, {
        status: 'rejected',
        requiresReview: false,
        reviewReason: `Removed by ${user?.name || 'Editor'}: ${finalReason}`
      });
      setShowRemoveDialog(false);
      onStoryUpdated?.();
      onClose();
    } catch (err) {
      console.error('Failed to remove story', err);
    } finally {
      setIsRemoving(false);
    }
  };

  const related = allStories
    .filter(s => s.id !== story.id && (s.category === story.category || s.primarySourceName === story.primarySourceName))
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
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008751] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Wire Feed
          </button>

          <div className="flex items-center gap-2">
            {/* Editor Quick Action Button if Logged In */}
            {isAuthenticated && (
              <button
                onClick={() => setShowRemoveDialog(true)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs mr-2"
                title="Remove this post from public blog"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Remove From Blog</span>
              </button>
            )}

            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                saved ? 'bg-emerald-50 text-[#008751] border border-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title="Bookmark story"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Share to WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={() => handleShare('copy')}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#008751]" /> : <ExternalLink className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Link'}</span>
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1"></div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Editorial Moderation Banner if Logged In */}
        {isAuthenticated && (
          <div className="bg-slate-900 text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-[#008751] text-white font-bold text-[10px] px-1.5 py-0.2 rounded uppercase">
                ADMIN MODERATION ACTIVE
              </span>
              <span className="text-slate-300">
                Confidence: <strong className="text-emerald-400 font-mono">{story.confidenceScore}%</strong> • Status: <strong>{story.status}</strong>
              </span>
            </div>
            <button
              onClick={() => setShowRemoveDialog(true)}
              className="text-red-300 hover:text-white bg-red-950/70 hover:bg-red-900 px-2.5 py-1 rounded font-semibold flex items-center gap-1 cursor-pointer border border-red-800"
            >
              <Trash2 className="w-3 h-3" />
              Take Down Unexpected Post
            </button>
          </div>
        )}

        {/* Modal Scrollable Article Body */}
        <div className="p-4 sm:p-8 md:p-10 max-h-[85vh] overflow-y-auto">
          {/* Header Metadata */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="bg-[#008751] text-white text-xs font-bold uppercase px-3 py-1 rounded-md shadow-xs">
              {story.category}
            </span>
            {story.isBreaking && (
              <span className="bg-[#991B1B] text-white text-xs font-bold uppercase px-3 py-1 rounded-md animate-pulse shadow-xs">
                Breaking Dispatch
              </span>
            )}
            <span className="text-slate-500 text-xs flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Dispatched: {formatFullDate(story.publishedAt)}
            </span>
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

          {/* MANDATORY SOURCE ATTRIBUTION CALLOUT BANNER */}
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
                  {story.sources.length > 1 && (
                    <p className="text-[11px] text-emerald-850 font-medium mt-0.5">
                      Corroborated across: {story.sources.map(s => s.sourceName).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <a
                href={story.primarySourceUrl}
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

          {/* Full Synthesized Narrative */}
          <div className="prose prose-slate max-w-none mb-8 text-slate-900 text-sm leading-relaxed font-serif space-y-4">
            {story.article.split('\n\n').map((para, i) => (
              <p key={i} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Mid-Article In-Feed Ad Slot */}
          <div className="my-8">
            <AdSlot format="banner" label="Editorial Partner Placement" />
          </div>

          {/* Multi-Source Corroboration Transparency Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#008751]" />
                Direct Source Outlets & Original Coverage
              </h3>
              <span className="text-[11px] font-mono text-[#008751] font-bold">
                {story.confidenceScore}% Fact Accuracy
              </span>
            </div>

            <div className="space-y-2">
              {story.sources.map((src, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#008751]"></span>
                    <span className="font-bold text-slate-900">{src.sourceName}</span>
                    <span className="text-slate-400">({src.category})</span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#008751] font-bold hover:underline flex items-center gap-1"
                  >
                    View Source Report <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {story.tags.map(t => (
                <span
                  key={t}
                  className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-semibold"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Editorial Transparency & Integrity Note */}
          <div className="bg-[#0F172A] text-slate-300 rounded-xl p-4 mb-8 text-xs border border-slate-800 shadow-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Editorial Transparency & Multi-Source Verification Note:</strong>
                <p className="text-slate-400 leading-relaxed">
                  This report has been curated and verified from primary news coverage published by <strong>{story.primarySourceName}</strong>. 
                  Our editorial system cross-references multiple Nigerian news outlets, verifies dates and official statistics, and provides direct links to original reporting.
                </p>
              </div>
            </div>
          </div>

          {/* Related Stories */}
          {related.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">
                Related Nigerian Stories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(r => (
                  <div
                    key={r.id}
                    onClick={() => onSelectRelatedStory(r)}
                    className="group bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-[#008751] hover:bg-white transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-16/10 rounded-lg overflow-hidden bg-slate-900 mb-2">
                        <img
                          src={r.image}
                          alt={r.headline}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#008751] uppercase block mb-1">
                        {r.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 font-serif leading-snug group-hover:text-[#008751] line-clamp-2">
                        {r.headline}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">
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
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
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
              <p className="text-slate-600">
                This will immediately remove <strong>"{story.headline}"</strong> from the public feed and archive it in the Newsroom Analysis Audit tab.
              </p>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Reason:
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
                    placeholder="Enter reason..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

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
                  {isRemoving ? 'Taking down...' : 'Confirm Removal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
