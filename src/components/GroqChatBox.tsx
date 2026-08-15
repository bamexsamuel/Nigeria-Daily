import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, X, Sparkles, Bot, User, RefreshCw, 
  ExternalLink, Zap, ShieldCheck, ChevronDown, Minimize2, Maximize2, Layers 
} from 'lucide-react';
import { api } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  sources?: Array<{ title: string; source: string; url: string }>;
}

const QUICK_PROMPTS = [
  'What is the latest CBN foreign exchange policy?',
  'What infrastructure projects did FEC approve?',
  'How is the Super Eagles camp in Uyo?',
  'What is the update on the $250M Lagos AI Data Center?'
];

const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', label: 'LLaMA 3.3 70B (Versatile)', speed: 'Ultra Fast • High Depth' },
  { id: 'llama-3.1-8b-instant', label: 'LLaMA 3.1 8B (Instant)', speed: 'Lightning Speed' },
  { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B (MoE)', speed: 'Deep Reasoning' }
];

interface GroqChatBoxProps {
  isOpen: boolean;
  onToggle: () => void;
  initialQuery?: string;
}

export const GroqChatBox: React.FC<GroqChatBoxProps> = ({ isOpen, onToggle, initialQuery }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: 'Welcome to **The Intelligence Brief** AI Assistant powered by Groq. Ask me anything regarding current Nigerian news, economic policies, politics, technology, infrastructure, or sports.',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' }),
      model: 'llama-3.3-70b-versatile'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const response = await api.askGroqChat(queryText, history, selectedModel);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        model: response.model || selectedModel,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Unable to reach the Groq chat engine at this time. Please try again.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-new',
        role: 'assistant',
        content: 'Chat cleared. How can I assist you with **The Intelligence Brief** on Nigerian current affairs?',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos' }),
        model: selectedModel
      }
    ]);
  };

  if (!isOpen) {
    return (
      <button
        id="groq-chat-launcher"
        onClick={onToggle}
        className="fixed bottom-5 right-5 z-40 bg-[#0F172A] hover:bg-slate-900 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-emerald-500/40 hover:scale-105 transition-all cursor-pointer group"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[#008751] flex items-center justify-center font-bold text-white shadow-xs">
            <Zap className="w-4 h-4 text-emerald-100" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0F172A] animate-ping"></span>
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black tracking-tight text-white">The Intelligence Brief</span>
            <span className="bg-orange-500/20 text-orange-400 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border border-orange-500/40">
              Groq AI
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Ask Nigerian News Q&A</p>
        </div>
      </button>
    );
  }

  return (
    <div
      id="groq-chat-modal-container"
      className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col bg-white border border-slate-300 overflow-hidden ${
        isExpanded
          ? 'inset-2 sm:inset-6 md:inset-10 rounded-2xl'
          : 'bottom-4 right-4 w-[95vw] sm:w-[440px] md:w-[480px] h-[580px] max-h-[88vh] rounded-2xl'
      }`}
    >
      {/* Top Header */}
      <div className="bg-[#0F172A] text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#008751] flex items-center justify-center font-bold text-white shadow-xs">
            <Zap className="w-4 h-4 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs sm:text-sm font-serif text-white">
                The Intelligence Brief
              </h3>
              <span className="bg-orange-500/20 text-orange-400 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border border-orange-500/40">
                Groq LPU™
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Instant Nigerian News Verification & Answers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title="Reset Chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer hidden sm:block"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Selection Toolbar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700">Model:</span>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs font-mono font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#008751]"
          >
            {GROQ_MODELS.map(m => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <span className="text-[10px] text-[#008751] font-bold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Top 5 Grounded
        </span>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8FAFC]">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[90%] sm:max-w-[85%]">
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-md bg-[#0F172A] text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-[#008751] text-white rounded-br-xs'
                    : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Sources Attribution */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                    <span className="font-bold text-slate-700 block mb-1 text-[10px] uppercase tracking-wider">
                      Grounding Sources:
                    </span>
                    <div className="flex flex-col gap-1">
                      {msg.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#008751] hover:underline flex items-center gap-1 font-semibold truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{src.source}: {src.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`mt-1.5 flex items-center justify-between text-[10px] ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  <span>{msg.timestamp}</span>
                  {msg.model && (
                    <span className="font-mono text-[9px]">
                      {msg.model.split('-').slice(0, 3).join('-')}
                    </span>
                  )}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-md bg-[#008751] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs py-2 bg-white p-3 rounded-xl border border-slate-200 w-fit">
            <RefreshCw className="w-3.5 h-3.5 text-[#008751] animate-spin" />
            <span>The Intelligence Brief synthesizing with Groq LPU...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-white border-t border-slate-100 px-3 py-2 overflow-x-auto flex gap-1.5 scrollbar-none">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-[#008751] text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-200 transition-colors cursor-pointer shrink-0 disabled:opacity-50 font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Nigerian AI News Hub (e.g. CBN rate, Tinubu, Super Eagles)..."
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#008751]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-[#008751] hover:bg-emerald-800 disabled:opacity-40 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
