/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Vote, 
  MapPin, 
  Loader2, 
  ShieldCheck,
  TrendingUp,
  Award,
  Lightbulb,
  UserPlus,
  History
} from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

// --- Internal Modules ---
import { LocationData } from './types';
import { 
  TIMELINE_DATA, 
  VOTER_TRENDS, 
  FAQS 
} from './constants';

// --- Components ---
import Navbar from './components/Navbar';
import ChatAssistant from './components/ChatAssistant';
import TimelineStep from './components/TimelineStep';
import VoterChecklist from './components/VoterChecklist';
import LocalMetrics from './components/LocalMetrics';
import HistoricalPulse from './components/HistoricalPulse';
import PollingStationMap from './components/PollingStationMap';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Institutional Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="pro-card max-w-md text-center">
            <ShieldCheck className="w-12 h-12 text-brand-blue mx-auto mb-4" />
            <h2 className="text-xl font-bold text-ink-900 mb-2">Protocol Disruption</h2>
            <p className="text-sm text-ink-700/60 mb-6">A procedural anomaly has occurred. Please refresh the interface to re-establish secure sync.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-brand-blue text-white rounded font-bold text-xs uppercase tracking-widest"
            >
              Re-Sync System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [zipCode, setZipCode] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [dailyTip, setDailyTip] = useState("Research local ballot measures to understand community impact.");

  // Logic to fetch a 'Pro-Tip' from Gemini or a static pool for alignment
  useEffect(() => {
    const tips = [
      "Check registration status 45 days before the cycle.",
      "Verify polling station locations 48 hours before voting.",
      "Review official sample ballots to save time at the booth.",
      "Ensure identification documents meet state-specific criteria."
    ];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isHighContrast]);

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
    <ErrorBoundary>
      <div className={`min-h-screen transition-colors duration-300 ${isHighContrast ? 'bg-neutral-900 font-sans' : 'bg-surface-50 font-sans'}`}>
        <Navbar isHighContrast={isHighContrast} toggleContrast={() => setIsHighContrast(!isHighContrast)} />

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
            
            {location && <LocalMetrics location={location} />}
            
            <HistoricalPulse />
            
            {location && <PollingStationMap location={location} />}
            
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
              <ChatAssistant 
                location={location ? `${location.city}, ${location.state}` : undefined} 
                zipCode={zipCode}
              />
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
  </ErrorBoundary>
  );
}
