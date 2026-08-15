import React from 'react';
import { X, ShieldCheck, Scale, FileText, CheckCircle2, Newspaper } from 'lucide-react';

interface PolicyModalProps {
  type: 'editorial' | 'ai' | 'about' | 'privacy';
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            {type === 'ai' && <ShieldCheck className="w-5 h-5 text-[#008751]" />}
            {type === 'editorial' && <Scale className="w-5 h-5 text-[#008751]" />}
            {type === 'about' && <Newspaper className="w-5 h-5 text-[#008751]" />}
            {type === 'privacy' && <FileText className="w-5 h-5 text-[#008751]" />}
            <h2 className="text-base font-black text-slate-900 font-serif">
              {type === 'ai' && 'Editorial Verification & Standards Disclosure'}
              {type === 'editorial' && 'Editorial Integrity & Multi-Source Wire Policy'}
              {type === 'about' && 'About Nigeria Daily Dispatch'}
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
                  Responsible Journalism & Verification Mandate
                </h3>
                <p className="text-xs text-emerald-900 leading-normal">
                  Nigeria Daily Dispatch operates a structured editorial verification pipeline. We extract factual information from authorized, reputable Nigerian news sources and present them into objective, concise, and verifiable reports.
                </p>
              </div>

              <h4 className="font-bold text-slate-900">1. Fact-First Verification Protocol</h4>
              <p>
                All data points are corroborated against multiple reputable Nigerian media reports and verified official announcements. Speculative rumors, uncorroborated claims, and unverified allegations are filtered.
              </p>

              <h4 className="font-bold text-slate-900">2. Sensitivity & Safety Gate</h4>
              <p>
                Stories touching upon fatalities, unconfirmed criminal accusations, ongoing trials, and election disputes are flagged with strict verification thresholds prior to dissemination.
              </p>

              <h4 className="font-bold text-slate-900">3. Corroboration Scoring</h4>
              <p>
                Each published dispatch displays a Corroboration & Fact Score (0-100%) indicating source density, confirmation across multiple newsrooms, and official record alignment.
              </p>
            </>
          )}

          {type === 'editorial' && (
            <>
              <h3 className="font-bold text-slate-900 text-base">Top 5 Nigerian Press Wire Attribution Standard</h3>
              <p>
                We recognize and celebrate the investigative reporting conducted by Nigeria's leading press institutions: <strong>The Punch, Channels Television, Premium Times, Vanguard News, and The Guardian Nigeria</strong>.
              </p>
              <p>
                Every published dispatch prominently features:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Primary publisher name and verified attribution badge</li>
                <li>Direct outbound hyperlink labeled "Read Original on [Outlet]"</li>
                <li>Corroborated secondary source listings</li>
                <li>Original publication timestamps in West Africa Time (WAT)</li>
              </ul>
              <h4 className="font-bold text-slate-900 mt-3">Corrections & Right of Reply</h4>
              <p>
                If an official agency or referenced party provides a rejoinder or factual correction, the story cluster is immediately updated to reflect the latest verified facts.
              </p>
            </>
          )}

          {type === 'about' && (
            <>
              <p>
                <strong>Nigeria Daily Dispatch</strong> is a national news aggregation and multi-source verification platform engineered for Nigerian citizens, policymakers, business leaders, and the global diaspora.
              </p>
              <p>
                By continuous real-time monitoring of Nigeria's top 5 news broadcasters and newspapers, our newsroom condenses breaking national affairs, CBN monetary policies, federal legislative actions, infrastructure milestones, and sports into fast, verified executive reports.
              </p>
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs">
                <p className="font-semibold text-slate-900 mb-1">Contact Newsroom Desk:</p>
                <p className="text-slate-600">Editorial Desk: newsroom@nigeriadaily.ng</p>
                <p className="text-slate-600">National Bureau: Victoria Island, Lagos / Abuja FCT</p>
              </div>
            </>
          )}

          {type === 'privacy' && (
            <>
              <h3 className="font-bold text-slate-900">Privacy & RSS Fair-Use Compliance</h3>
              <p>
                Nigeria Daily Dispatch respects intellectual property, publisher copyright, and web standards. We ingest publicly syndicated RSS feeds for metadata and indexing, synthesizing original structured analytical summaries while always linking back directly to publisher landing pages.
              </p>
              <p>
                No personally identifiable information (PII) is sold or distributed. Subscriber emails for the Daily Morning Briefing are stored securely and never shared with third parties.
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
