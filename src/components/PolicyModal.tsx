import React from 'react';
import { X, ShieldCheck, Sparkles, Scale, FileText, CheckCircle2 } from 'lucide-react';

interface PolicyModalProps {
  type: 'editorial' | 'ai' | 'about' | 'privacy';
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            {type === 'ai' && <Sparkles className="w-5 h-5 text-[#008751]" />}
            {type === 'editorial' && <Scale className="w-5 h-5 text-[#008751]" />}
            {type === 'about' && <ShieldCheck className="w-5 h-5 text-[#008751]" />}
            {type === 'privacy' && <FileText className="w-5 h-5 text-[#008751]" />}
            <h2 className="text-base font-black text-slate-900 font-serif">
              {type === 'ai' && 'AI Editorial Transparency & Disclosure'}
              {type === 'editorial' && 'Editorial Integrity & Attribution Policy'}
              {type === 'about' && 'About Nigerian AI News Hub'}
              {type === 'privacy' && 'Privacy & Publisher Compliance'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-sm text-slate-700 space-y-4 leading-relaxed">
          {type === 'ai' && (
            <>
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl shadow-2xs">
                <h3 className="font-bold text-emerald-950 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#008751]" />
                  Responsible AI Journalism Mandate
                </h3>
                <p className="text-xs text-emerald-900 leading-normal">
                  Nigerian AI News Hub operates an automated editorial synthesis pipeline utilizing Google Gemini. We extract factual information from authorized, reputable Nigerian news sources and rewrite them into objective, concise, and structured summaries.
                </p>
              </div>

              <h4 className="font-bold text-slate-900">1. Fact-First Verification Engine</h4>
              <p>
                The AI is constrained by strict temperature parameters and deterministic schemas to prevent hallucination. It is forbidden from inventing names, official quotes, statistics, or dates.
              </p>

              <h4 className="font-bold text-slate-900">2. Sensitivity Gate</h4>
              <p>
                Stories touching upon fatalities, unconfirmed criminal accusations, ongoing trials, and election disputes are flagged with a low confidence threshold and held in an administrative Review Queue prior to publication.
              </p>

              <h4 className="font-bold text-slate-900">3. Confidence Scoring</h4>
              <p>
                Each published dispatch displays an AI Confidence Score (0-100%) indicating source corroboration density and clarity.
              </p>
            </>
          )}

          {type === 'editorial' && (
            <>
              <h3 className="font-bold text-slate-900 text-base">Top 5 Nigerian Channels Attribution Standard</h3>
              <p>
                We recognize that original investigative reporting is conducted by premier Nigerian press organizations, notably <strong>Channels Television, The Punch, Premium Times, Vanguard News, and The Guardian Nigeria</strong>.
              </p>
              <p>
                Every synthesized article prominently features:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Primary publisher name and badge</li>
                <li>Direct outbound hyperlink labeled "Read Original Report"</li>
                <li>Corroborated secondary source listings</li>
                <li>Original discovery and publication timestamps in West Africa Time (WAT)</li>
              </ul>
              <h4 className="font-bold text-slate-900 mt-3">Corrections & Right of Reply</h4>
              <p>
                If an official agency or referenced party provides a rejoinder or factual correction, the system automatically updates the article's story cluster and indicates the timestamped modification.
              </p>
            </>
          )}

          {type === 'about' && (
            <>
              <p>
                <strong>Nigerian AI News Hub</strong> is a next-generation news platform engineered for Nigerian audiences at home and across the diaspora.
              </p>
              <p>
                By continuous real-time monitoring of Nigeria's top 5 news broadcasters and newspapers, our engine condenses breaking national affairs, CBN monetary policies, federal legislative actions, tech ecosystem milestones, and sports into fast, readable executive summaries.
              </p>
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs">
                <p className="font-semibold text-slate-900 mb-1">Contact Newsroom & AI Bureau:</p>
                <p className="text-slate-600">Editorial Desk: newsroom@nigerianainewshub.ng</p>
                <p className="text-slate-600">Lagos Bureau: Victoria Island / Abuja FCT</p>
              </div>
            </>
          )}

          {type === 'privacy' && (
            <>
              <h3 className="font-bold text-slate-900">Privacy & RSS Fair-Use Compliance</h3>
              <p>
                Nigerian AI News Hub respects intellectual property, publisher copyright, and robots.txt directives. We ingest publicly syndicated RSS feeds for metadata and indexing, synthesizing original structured analytical summaries while always linking back directly to publisher landing pages.
              </p>
              <p>
                No personally identifiable information (PII) is sold or distributed. Subscriber emails for the Daily Nigerian News Digest are stored securely and never shared with third parties.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
