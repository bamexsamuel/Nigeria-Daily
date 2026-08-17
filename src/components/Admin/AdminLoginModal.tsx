import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, Lock, Mail, KeyRound, AlertCircle, X, 
  CheckCircle2, Newspaper, ArrowRight, UserCheck
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { login, quickDemoLogin } = useAdminAuth();
  const [email, setEmail] = useState('editor@nigeriadaily.ng');
  const [password, setPassword] = useState('editorial2026');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await login(email, password);
      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrorMessage(res.error || 'Authentication failed.');
      }
    } catch {
      setErrorMessage('Unexpected server error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    quickDemoLogin();
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#008751] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-white">
                Newsroom Desk Login
              </h2>
              <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
                Authorized Editorial Access
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Sign in to access the news analysis dashboard, review incoming wire feeds, and remove unwanted or uncorroborated dispatches from the public blog.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Editorial Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="editor@nigeriadaily.ng"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#008751] focus:bg-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Passcode / Newsroom Token
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#008751] focus:bg-white"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              {loading ? 'Authenticating...' : 'Sign In to Editorial Newsroom'}
            </button>
          </form>

          {/* Quick Demo Login Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Or Fast Access
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#008751] border border-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            1-Click Senior Editor Access
          </button>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0 mt-0.5" />
            <p>
              <strong>Admin Capabilities:</strong> Live post takedowns, quality gate metrics, source reliability analysis, RSS feed controller, and instant blog post moderation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
