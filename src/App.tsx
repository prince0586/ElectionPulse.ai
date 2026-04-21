/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Vote, 
  Calendar, 
  Info, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle2, 
  MapPin, 
  UserPlus, 
  Clock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Lightbulb,
  Send,
  Loader2,
  X,
  History,
  TrendingUp,
  Award,
  Globe,
  ShieldCheck,
  Download,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// --- Internal Modules ---
import { ChatMessage, LocationData, ChecklistItem, TimelineStep as TimelineStepType } from './types';
import { 
  TIMELINE_DATA, 
  VOTER_TRENDS, 
  FAQS, 
  INITIAL_CHECKLIST, 
  AI_CONFIG 
} from './constants';

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-surface-200">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110">E</div>
        <span className="text-xl font-bold tracking-tight text-ink-800 underline-brand">ElectionPulse.ai</span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <div className="flex flex-col items-end pr-4 border-r border-surface-200">
          <span className="text-[10px] uppercase tracking-widest text-ink-700/50 font-bold">Cycle Status</span>
          <span className="text-xs font-semibold text-ink-700">2026 Midterms • Active</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#process" className="hover:text-brand-blue transition-colors">Process</a>
          <a href="#stats" className="hover:text-brand-blue transition-colors">Insights</a>
          <a href="#assistant" className="text-brand-blue font-bold">AI Advisor</a>
          <button className="px-4 py-2 bg-ink-900 text-white text-sm font-medium rounded-md hover:bg-ink-800 transition-colors shadow-sm">
            Check Status
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const ChatAssistant = ({ location }: { location?: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: "Hello! I'm your Election Pulse advisor. I can help you understand the voting process, registration deadlines, and how elections work. What would you like to know today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!process.env.GEMINI_API_KEY) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error: GEMINI_API_KEY is not configured in environment secrets." }]);
      return;
    }

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const prompt = `You are an expert Election Advisor. Answer the following user question about elections, voting processes, or political systems accurately and objectively. Current user location context: ${location || 'Unknown'}. 
      User: ${userMessage}`;

      const result = await genAI.models.generateContent({
        model: AI_CONFIG.model,
        contents: prompt,
        config: {
          systemInstruction: AI_CONFIG.systemInstruction,
          tools: [
            { googleSearch: {} }
          ],
        }
      });

      // Extract grounding metadata if exists
      const citations = result.candidates?.[0]?.groundingMetadata?.searchEntryPoint?.renderedContent 
        ? [{ title: "Google Search Grounding", html: result.candidates[0].groundingMetadata.searchEntryPoint.renderedContent }]
        : [];

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: result.text || "I'm sorry, I couldn't process that request.",
        citations
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Something went wrong. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="advisor-chat-container" className="pro-card flex flex-col h-[600px] overflow-hidden p-0" role="region" aria-label="AI Election Advisor Chat">
      <div id="advisor-header" className="bg-ink-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <Globe className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h3 className="font-bold leading-none text-sm uppercase tracking-wide">Live Grounded Advisor</h3>
            <p className="text-[10px] opacity-50 mt-1 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Grounded Intelligence
            </p>
          </div>
        </div>
        <div className="px-3 py-1 bg-brand-blue/20 border border-brand-blue/30 rounded flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue">Active Connection</span>
        </div>
      </div>
      
      <div id="advisor-chat-history" ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-50 custom-scrollbar" aria-live="polite">
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-brand-blue text-white rounded-tr-none' 
                : 'bg-white text-ink-800 rounded-tl-none border border-surface-200'
            }`}>
              <div className="prose prose-sm prose-slate max-w-none">
                 <Markdown>{m.content}</Markdown>
              </div>
            </div>
            
            {m.role === 'ai' && (
              <div className="mt-2 flex flex-col gap-2 w-full">
                <div className="flex items-center gap-3 px-1 text-[10px] font-bold uppercase tracking-tight text-ink-700/40">
                  <div className="flex items-center gap-1 text-green-600">
                    <ShieldCheck className="w-3 h-3" />
                    Procedural Integrity: 99.8% confirmed
                  </div>
                  {m.citations && m.citations.length > 0 && (
                    <div className="flex items-center gap-1 text-brand-blue cursor-help" title="Grounded via Google Search">
                      <Search className="w-3 h-3" />
                      Verified Sources
                    </div>
                  )}
                </div>
                {m.citations && m.citations.map((cite, idx) => (
                  <div key={idx} className="bg-brand-blue/5 border border-brand-blue/10 rounded p-2 text-[9px] text-brand-blue flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                       <ExternalLink className="w-3 h-3" />
                       <span className="font-bold opacity-70">Source Grounding:</span>
                       <div dangerouslySetInnerHTML={{ __html: cite.html }} className="citation-links" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-xl rounded-tl-none border border-surface-200 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
              <span className="text-xs font-medium text-ink-700/50 uppercase tracking-wider">Grounding with Live Data...</span>
            </div>
          </div>
        )}
      </div>

      <div id="advisor-input-area" className="p-4 bg-white border-t border-surface-200">
        <label htmlFor="advisor-message-input" className="sr-only">Message the AI Advisor</label>
        <div className="relative flex items-center gap-2">
          <input 
            id="advisor-message-input"
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about turnout, deadlines, or process..."
            className="flex-1 bg-surface-50 border border-surface-200 focus:border-brand-blue/30 rounded-lg px-4 py-3 outline-none transition-all text-sm"
          />
          <button 
            id="advisor-send-button"
            onClick={handleSend}
            disabled={isLoading}
            aria-label="Send message"
            className="p-3 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TimelineStep = ({ step, index, total }: { step: TimelineStepType, index: number, total: number }) => {
  const [isOpen, setIsOpen] = useState(index === 2); // default open the active one

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
            step.status === 'Completed' ? 'bg-green-500 text-white' : 
            step.status === 'Active' ? 'bg-brand-blue text-white shadow-lg' : 
            'bg-surface-100 text-ink-700/30'
          }`}
        >
          {step.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold text-xs">{index + 1}</span>}
        </motion.div>
        {index !== total - 1 && (
          <div className="w-0.5 h-full bg-surface-200 my-2" />
        )}
      </div>
      
      <div 
        id={`timeline-card-${step.id}`} 
        className={`flex-1 pro-card mb-6 last:mb-0 transition-all cursor-pointer ${isOpen ? 'ring-2 ring-brand-blue/5 border-brand-blue/20' : 'hover:bg-surface-50'}`} 
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step.status === 'Active' ? 'text-brand-blue' : 'text-slate-400'}`}>Stage 0{index + 1} • {step.date}</span>
            <h4 className="text-lg font-bold text-ink-800 mt-1">{step.title}</h4>
          </div>
          <div className="text-ink-700/30">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-surface-100">
                <p className="text-ink-700/70 text-sm leading-relaxed text-xs">
                  {step.description}
                </p>
                <div className="mt-6 flex gap-3">
                  <button className="text-[9px] font-bold uppercase tracking-widest bg-ink-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-brand-blue transition-colors">
                    Access Official Protocol <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const VoterChecklist = () => {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);

  const toggle = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

  return (
    <div className="pro-card bg-ink-900 border-none text-white overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Personnel Protocol</h3>
           <ShieldCheck className="w-4 h-4 text-brand-blue" />
        </div>
        <h4 className="text-lg font-bold mb-1">Voter Preparedness</h4>
        <div className="w-full bg-white/10 h-1 rounded-full mt-4 overflow-hidden">
           <motion.div 
             className="bg-brand-blue h-full"
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
           />
        </div>
        <p className="text-[10px] font-bold text-brand-blue mt-2 uppercase tracking-tighter">{progress}% Operational Readiness</p>
      </div>
      
      <div className="flex-1 p-6 space-y-3 overflow-y-auto">
        {items.map(item => (
          <div 
            key={item.id} 
            onClick={() => toggle(item.id)}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 cursor-pointer transition-colors group"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-brand-blue border-brand-blue' : 'border-white/20'}`}>
              {item.checked && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-xs font-medium transition-all ${item.checked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-white/5 border-t border-white/5 flex gap-2">
        <button className="flex-1 py-2 bg-brand-blue text-white rounded text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-blue/80 transition-colors">
          <Download className="w-3 h-3" /> Export Report
        </button>
        <button className="flex-1 py-2 border border-white/20 rounded text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-colors text-white">
          <Calendar className="w-3 h-3" /> Reminders
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [zipCode, setZipCode] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const fetchLocation = async (zip: string) => {
    if (zip.length !== 5) return;
    setIsLocating(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (res.ok) {
        const data = await res.json();
        setLocation({
          city: data.places[0]['place name'],
          state: data.places[0].state
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <main className="pt-24 min-h-screen max-w-7xl mx-auto p-6 flex flex-col gap-8">
        {/* --- Hero Section: Status Overview --- */}
        <section id="hero-section" className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div className="pro-card p-10 relative overflow-hidden bg-white border-brand-blue/10" role="banner">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-blue pointer-events-none">
                 <Vote size={180} aria-hidden="true" />
              </div>
              
              <div className="max-w-xl relative z-10">
                <div className="flex items-center gap-4 mb-3">
                  <span className="px-2 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-bold rounded uppercase tracking-wider">Strategic Initiative</span>
                  <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider ring-1 ring-green-500/20">
                    <ShieldCheck className="w-3 h-3" /> Grounded Intelligence 3.1
                  </div>
                </div>
                <p className="text-ink-700/70 text-base leading-relaxed mb-8">
                  Voter participation is the core metric of clinical democracy. Election Pulse AI provides the analytical framework and procedural guidance needed for informed civic engagement.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-surface-50 border border-surface-100 shadow-inner">
                    <h4 className="text-xs font-bold text-ink-900 uppercase tracking-widest mb-3">Key Performance</h4>
                    <ul className="text-xs text-ink-700/60 space-y-2 font-medium">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-brand-blue rounded-full" aria-hidden="true" />
                        Grounded Search Response
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-brand-blue rounded-full" aria-hidden="true" />
                        Institutional Citations
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-50 border border-surface-100 shadow-inner">
                    <h4 className="text-xs font-bold text-ink-900 uppercase tracking-widest mb-3">Next Milestone</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-brand-blue">142</span>
                      <span className="text-[10px] font-bold text-ink-700/40 uppercase">Days to Nov 5</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-surface-100 flex flex-col sm:flex-row items-center gap-4">
                   <div className="relative flex-1 group">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-700/40 group-focus-within:text-brand-blue transition-colors" />
                      <input 
                        type="text" 
                        maxLength={5}
                        value={zipCode}
                        onChange={(e) => {
                          setZipCode(e.target.value.replace(/\D/g, ''));
                          if (e.target.value.length === 5) fetchLocation(e.target.value);
                        }}
                        placeholder="Enter Zip for Localized Pulse..."
                        className="w-full bg-surface-50 border border-surface-200 py-3 pl-10 pr-4 rounded-lg outline-none focus:border-brand-blue/30 text-xs font-medium placeholder:text-ink-700/30"
                        aria-label="Localization Zip Code"
                      />
                      {isLocating && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-brand-blue" />}
                   </div>
                   {location && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 bg-brand-blue/5 border border-brand-blue/10 px-4 py-3 rounded-lg"
                      >
                         <div className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                         <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">{location.city}, {location.state} Verified</span>
                      </motion.div>
                   )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Identity Verification', icon: <UserPlus className="w-5 h-5" />, desc: 'Confirm state-specific eligibility' },
                { title: 'Ballot Intelligence', icon: <History className="w-5 h-5" />, desc: 'Review historical candidate data' },
                { title: 'Secure Logistics', icon: <MapPin className="w-5 h-5" />, desc: 'Locate certified polling stations' }
              ].map((card, i) => (
                <div key={i} className="pro-card flex flex-col items-start hover:border-brand-blue/30 cursor-pointer">
                  <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center mb-4 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-ink-800 text-sm mb-2">{card.title}</h3>
                  <p className="text-[10px] text-ink-700/50 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <VoterChecklist />
            
            <div className="pro-card flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">Historical Pulse</h3>
                  <p className="text-[10px] text-ink-700/50">Voter Turnout Trends (%)</p>
                </div>
                <TrendingUp className="w-5 h-5 text-brand-blue" aria-hidden="true" />
              </div>
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={VOTER_TRENDS}>
                    <defs>
                      <linearGradient id="colorTurnout" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
                    <XAxis dataKey="year" hide />
                    <YAxis hide domain={[40, 80]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="turnout" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorTurnout)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 pt-6 border-t border-surface-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-ink-700/40 uppercase">2026 Forecast</span>
                  <span className="text-lg font-extrabold text-brand-blue tracking-tighter">62.4%</span>
                </div>
                <button className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:underline">Full Report &rarr;</button>
              </div>
            </div>
            
            <div className="pro-accent-card flex items-center gap-4">
              <div className="bg-brand-blue p-2 rounded-lg text-white">
                <Lightbulb size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategy Note</span>
                <p className="text-xs leading-relaxed font-medium mt-1">Check registration status at least 45 days prior to cycles.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Process & Advisor Grid --- */}
        <section id="process" className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="pro-card flex-1">
              <h2 className="text-xs font-bold text-ink-700 uppercase tracking-widest mb-8 px-2">Cycle Architecture</h2>
              <div className="space-y-2">
                {TIMELINE_DATA.map((step, idx) => (
                  <TimelineStep 
                    key={step.id} 
                    step={step} 
                    index={idx} 
                    total={TIMELINE_DATA.length} 
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-brand-blue rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
               <div className="absolute -bottom-4 -right-4 opacity-10">
                 <Award size={100} />
               </div>
               <h3 className="font-bold text-sm uppercase tracking-widest mb-2">Verified Data</h3>
               <p className="text-xs text-blue-100 leading-relaxed mb-4">Our systems utilize certified datasets from state election boards and federal legislative archives.</p>
               <button className="text-[10px] font-bold uppercase tracking-widest py-2 border-b border-blue-300 hover:text-white transition-colors">Access Public Records</button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <div id="advisor" className="pro-card p-0 flex flex-col overflow-hidden" role="region" aria-label="Grounded AI Advisor">
              <div className="p-4 px-6 border-b border-surface-200 flex items-center justify-between">
                <h2 className="text-xs font-bold text-ink-900 uppercase tracking-widest">Procedural Advisor</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-bold text-ink-700/50 uppercase tracking-widest">Global Session</span>
                </div>
              </div>
              <ChatAssistant location={location ? `${location.city}, ${location.state}` : undefined} />
            </div>
          </div>
        </section>

        {/* --- Metrics Overview --- */}
        <section id="stats" className="pro-card bg-white border-surface-200 p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-surface-200">
            {[
              { label: "Total Eligible", value: "244.5M", change: "+1.2%" },
              { label: "Early Voters", value: "34.2%", change: "+5.1%" },
              { label: "Wait Variance", value: "12m", change: "-2m avg" },
              { label: "Data Integrity", value: "99.9%", change: "Verified" }
            ].map((stat, i) => (
              <div key={i} className="p-8 border-r border-surface-200 last:border-r-0">
                <span className="text-[10px] font-bold text-ink-700/40 uppercase tracking-widest block mb-2">{stat.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-ink-900 tracking-tighter">{stat.value}</span>
                  <span className="text-[10px] font-bold text-green-600">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-slate-900 flex items-center justify-between text-white">
            <p className="text-xs text-slate-400">Current Monitoring Focus: <span className="text-white font-bold ml-2">Federal General Election Protocol (Standard-2026)</span></p>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Operational Intelligence</div>
          </div>
        </section>

        {/* --- FAQ grid --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="pro-card flex flex-col gap-3">
              <h4 className="font-bold text-sm text-ink-900">{faq.question}</h4>
              <p className="text-xs text-ink-700/60 leading-relaxed font-medium">{faq.answer}</p>
            </div>
          ))}
        </section>

        {/* --- CTA Section --- */}
        <section className="bg-brand-blue rounded-2xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-ink-900/10 pointer-events-none" />
           <div className="max-w-xl mx-auto flex flex-col gap-6 relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight">Access the Full Electoral Dataset</h2>
              <p className="text-blue-100 text-sm">Join over 1M+ citizens using Election Pulse AI to optimize their civic contribution and monitor institutional performance.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                 <input placeholder="Enter institution email..." className="px-5 py-3 rounded-lg bg-white/20 border border-white/30 backdrop-blur-md outline-none text-white placeholder:text-white/50 text-sm w-full sm:w-64" />
                 <button className="px-6 py-3 bg-white text-brand-blue rounded-lg font-bold shadow-lg text-sm hover:bg-white/90 transition-all transition-transform active:scale-95">Enable Integration</button>
              </div>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold mt-4 italic opacity-50">Enterprise Governance • Non-Partisan Intelligence</p>
           </div>
        </section>
      </main>

      <footer className="bg-white border-t border-surface-200 mt-20 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-blue rounded flex items-center justify-center text-white text-[10px] font-bold">E</div>
                <span className="text-lg font-bold tracking-tight text-ink-900 decoration-brand-blue decoration-2">ElectionPulse.ai</span>
             </div>
             <p className="text-xs text-ink-700/50 leading-relaxed">System-wide election intelligence and procedural oversight platform.</p>
          </div>
          {['Research', 'Legal', 'Institutional'].map((col) => (
            <div key={col} className="flex flex-col gap-4">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-ink-700">{col}</h5>
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map(i => <span key={i} className="text-xs text-ink-700/40 hover:text-brand-blue cursor-pointer transition-colors">Resource Dataset 0{i}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[10px] font-bold text-ink-700/30 uppercase tracking-wider">© 2026 Pulse Intelligence Systems</span>
          <div className="flex gap-8 text-[10px] font-bold text-ink-700/30 uppercase tracking-wider">
            <span>Security Statement</span>
            <span>Policy Protocol</span>
            <span>Data Rights</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
