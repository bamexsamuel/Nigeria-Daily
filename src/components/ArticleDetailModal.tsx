import React, { useState } from 'react';
import { Story } from '../types';
import { 
  X, Clock, ExternalLink, ShieldCheck, Sparkles, Share2, 
  Check, MessageSquare, Tag, AlertCircle, ArrowLeft, Bookmark
} from 'lucide-react';
import { AdSlot } from './AdSlot';

interface ArticleDetailModalProps {
  story: Story;
  onClose: () => void;
  onSelectRelatedStory: (story: Story) => void;
  allStories: Story[];
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  story,
  onClose,
  onSelectRelatedStory,
  allStories
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

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
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\nRead on Nigerian AI News Hub: ${url}`)}`, '_blank');
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

  const related = allStories
    .filter(s => s.id !== story.id && (s.category === story.category || s.primarySourceName === story.primarySourceName))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6">
      <div 
        id="article-detail-container"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200/90"
      >
        {/* Top Action Sticky Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#008751] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News Feed
          </button>

          <div className="flex items-center gap-2">
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
              className="bg-[#008751] hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Article Body */}
        <div className="p-4 sm:p-8 md:p-10 max-h-[85vh] overflow-y-auto">
          {/* Header Metadata */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="bg-[#008751] text-white text-xs font-bold uppercase px-3 py-1 rounded-md shadow-xs">
              {story.category}
            </span>
            {story.isBreaking && (
              <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-md animate-pulse shadow-xs">
                Breaking News
              </span>
            )}
            <span className="text-slate-500 text-xs flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Published: {formatFullDate(story.publishedAt)}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 font-serif leading-tight mb-4">
            {story.headline}
          </h1>

          {/* Executive Summary Callout */}
          <div className="bg-slate-50 border-l-4 border-[#008751] p-4 rounded-r-xl mb-6 text-slate-800 font-medium text-base leading-relaxed">
            {story.summary}
          </div>

          {/* Byline & Verified AI Synthesizer Attribution Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-100/70 rounded-xl border border-slate-200/80 mb-6 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#008751] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AI
              </div>
              <div>
                <p className="font-bold text-slate-900">Nigerian AI News Hub Editorial Desk</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified with Google Gemini • {story.aiModelUsed}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono text-[#008751] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/70">
                <Sparkles className="w-3.5 h-3.5 text-[#008751]" />
                <span className="font-bold">{story.confidenceScore}%</span> Fact Score
              </div>
              <span className="font-medium text-slate-500">{story.readingTimeMinutes} min read</span>
            </div>
          </div>

          {/* MANDATORY SOURCE ATTRIBUTION CALLOUT BANNER (PRD Section 3 & 43) */}
          <div 
            id="mandatory-source-attribution" 
            className="bg-emerald-50/90 border border-emerald-300 rounded-xl p-4 mb-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#008751] shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-xs text-emerald-950 font-bold">
                    Original Source Reporting: <strong className="text-[#008751] font-black">{story.primarySourceName}</strong>
                  </p>
                  {story.sources.length > 1 && (
                    <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                      Story cluster corroborated across: {story.sources.map(s => s.sourceName).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <a
                href={story.primarySourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#008751] hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Read Original Report
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-6 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
            <img
              src={story.image}
              alt={story.headline}
              referrerPolicy="no-referrer"
              className="w-full max-h-[460px] object-cover"
            />
            {story.imageCaption && (
              <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 flex items-center justify-between">
                <span>{story.imageCaption}</span>
                {story.imageCredit && <span className="text-slate-400 text-[11px]">Photo: {story.imageCredit}</span>}
              </div>
            )}
          </div>

          {/* KEY POINTS BOX (PRD Section 13) */}
          {story.keyPoints && story.keyPoints.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 mb-8">
              <h2 className="text-xs font-black uppercase tracking-wider text-amber-950 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                Key Points & Takeaways
              </h2>
              <ul className="space-y-2">
                {story.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug">
                    <span className="text-amber-700 font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* STRUCTURED ARTICLE BODY (PRD Section 13) */}
          <div className="space-y-6 text-slate-800 text-base leading-relaxed font-serif">
            {/* Section 1: What Happened? */}
            {story.whatHappened && (
              <div>
                <h3 className="text-lg font-bold font-sans text-slate-900 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
                  <span className="text-[#008751] font-mono text-sm font-bold">01.</span> What Happened?
                </h3>
                <p className="whitespace-pre-line">{story.whatHappened}</p>
              </div>
            )}

            {/* In-Article Ad Slot */}
            <AdSlot format="in-feed" label="Sponsored Content" />

            {/* Section 2: Detailed Story */}
            {story.mainStory && (
              <div>
                <h3 className="text-lg font-bold font-sans text-slate-900 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
                  <span className="text-[#008751] font-mono text-sm font-bold">02.</span> Main Story & Facts
                </h3>
                <p className="whitespace-pre-line">{story.mainStory}</p>
              </div>
            )}

            {/* Section 3: Background */}
            {story.background && (
              <div>
                <h3 className="text-lg font-bold font-sans text-slate-900 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
                  <span className="text-[#008751] font-mono text-sm font-bold">03.</span> Background & Nigerian Context
                </h3>
                <p className="whitespace-pre-line text-slate-700">{story.background}</p>
              </div>
            )}

            {/* Section 4: What Happens Next? */}
            {story.whatHappensNext && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-base font-bold font-sans text-slate-900 mb-1.5 flex items-center gap-2">
                  <span className="text-[#008751] font-mono text-sm font-bold">04.</span> What Happens Next?
                </h3>
                <p className="whitespace-pre-line text-slate-700 text-sm">{story.whatHappensNext}</p>
              </div>
            )}
          </div>

          {/* Social Share Ribbon */}
          <div className="my-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Share This Verified Dispatch:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare('whatsapp')}
                className="px-3 py-1.5 bg-[#008751] hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('x')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                X (Twitter)
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-200 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#008751]" /> : null}
                {copied ? 'Copied Link' : 'Copy Link'}
              </button>
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

          {/* AI Editorial Disclosure Callout (PRD Section 44) */}
          <div className="bg-[#0F172A] text-slate-300 rounded-xl p-4 mb-8 text-xs border border-slate-800 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Editorial Transparency & Integrity Note:</strong>
                <p className="text-slate-400 leading-relaxed">
                  This news article was automatically synthesized by Google Gemini using authenticated press dispatches from <strong>{story.primarySourceName}</strong>. 
                  Our pipeline verifies factual consistency against official Nigerian government databases, strips unverified claims, and provides full direct attribution to the primary publisher.
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
    </div>
  );
};
