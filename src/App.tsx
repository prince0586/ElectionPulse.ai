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

import { ThemeType, THEMES } from './constants.tsx';

export default function App() {
  const [zipCode, setZipCode] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('minimal');
  const [dailyTip, setDailyTip] = useState("Research local ballot measures to understand community impact.");

  // Apply theme-specific typography and variables to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-institutional', 'theme-brutalist', 'theme-minimal', 'theme-editorial');
    root.classList.add(`theme-${theme}`);
    
    // Smooth transition trigger
    root.style.setProperty('--theme-transition', '0.5s');
  }, [theme]);

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
      <div className={`min-h-screen transition-all duration-500 overflow-x-hidden ${isHighContrast ? 'bg-neutral-900 high-contrast' : 'bg-surface-50 font-sans'}`}>
        <Navbar 
          isHighContrast={isHighContrast} 
          toggleContrast={() => setIsHighContrast(!isHighContrast)} 
          currentTheme={theme}
          setTheme={setTheme}
        />

      <main className="pt-20 sm:pt-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-8 sm:gap-10">

        {/* --- Hero Section: Status Overview --- */}
        <section id="hero-section" className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
            <div className="pro-card p-5 sm:p-8 md:p-12 relative overflow-hidden bg-white border-brand-blue/5" role="banner">
              <div className="absolute -top-12 -right-12 p-12 opacity-5 text-brand-blue pointer-events-none transform rotate-12">
                 <Vote size={240} aria-hidden="true" />
              </div>
              
              <div className="max-w-2xl relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-ink-900 text-white text-[10px] font-bold rounded-full uppercase tracking-[0.15em]">Strategic Initiative</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-[0.1em] ring-1 ring-green-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> Grounded Intelligence 4.0
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.1] sm:leading-[0.95] mb-6 tracking-tight text-ink-900">
                  Clinical <span className="text-brand-blue">Civic</span> Integration.
                </h1>
                
                <p className="text-ink-700/70 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg">
                  Voter participation is the core pulse of democracy. We provide the analytical framework and procedural architecture needed for high-fidelity engagement.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
                  <div className="p-5 sm:p-6 rounded-2xl bg-surface-100 border border-surface-200/50">
                    <h4 className="text-[10px] sm:text-[11px] font-bold text-ink-700 uppercase tracking-[0.2em] mb-4">Metric Focus</h4>
                    <ul className="text-xs text-ink-800 space-y-3 font-semibold">
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-brand-blue rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        Grounded Search Response
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                        Institutional Citations
                      </li>
                    </ul>
                  </div>
                  <div className="p-5 sm:p-6 rounded-2xl bg-surface-100 border border-surface-200/50">
                    <h4 className="text-[10px] sm:text-[11px] font-bold text-ink-700 uppercase tracking-[0.2em] mb-4">Next Milestone</h4>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-4xl font-display font-black text-ink-900">142</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-ink-700/50 uppercase tracking-widest">Days to Cycle</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-surface-100 flex flex-col sm:flex-row items-center gap-5">
                   <div className="relative flex-1 group w-full">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-700/30 group-focus-within:text-brand-blue transition-colors" />
                      <input 
                        type="text" 
                        maxLength={5}
                        value={zipCode}
                        onChange={(e) => {
                          setZipCode(e.target.value.replace(/\D/g, ''));
                          if (e.target.value.length === 5) fetchLocation(e.target.value);
                        }}
                        placeholder="Enter location code for localized sync..."
                        className="w-full bg-surface-50 border border-surface-200 py-4 pl-12 pr-4 rounded-xl outline-none focus:border-brand-blue/30 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.05)] text-sm font-medium placeholder:text-ink-700/30 transition-all"
                        aria-label="Localization Zip Code"
                      />
                      {isLocating && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-brand-blue" />}
                   </div>
                   {location && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 bg-ink-900 text-white px-5 py-4 rounded-xl border border-white/10 shadow-lg w-full sm:w-auto"
                      >
                         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                         <span className="text-[11px] font-bold uppercase tracking-[0.1em]">{location.city} Protocol Verified</span>
                      </motion.div>
                   )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Identity Verification', icon: <UserPlus className="w-5 h-5" />, desc: 'Confirm state-specific eligibility' },
                { title: 'Ballot Intelligence', icon: <History className="w-5 h-5" />, desc: 'Review historical candidate data' },
                { title: 'Secure Logistics', icon: <MapPin className="w-5 h-5" />, desc: 'Locate certified polling stations' }
              ].map((card, i) => (
                <div key={i} className={`pro-card flex flex-col items-start group cursor-pointer hover:border-ink-900/10 ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                  <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center mb-6 text-brand-blue transition-all duration-300 group-hover:bg-ink-900 group-hover:text-white group-hover:rotate-6">
                    {card.icon}
                  </div>
                  <h3 className="font-display font-bold text-ink-900 text-base mb-3">{card.title}</h3>
                  <p className="text-[12px] text-ink-700/60 leading-relaxed font-medium">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
            <VoterChecklist />
            
            {location && <LocalMetrics location={location} />}
            
            <HistoricalPulse />
            
            {location && <PollingStationMap location={location} />}
            
            <div className="pro-accent-card flex items-center gap-4 sm:gap-5 relative overflow-hidden noir-gradient">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
              <div className="bg-white/10 p-3 rounded-xl text-white backdrop-blur-sm border border-white/10">
                <Lightbulb size={24} />
              </div>
              <div className="relative z-10">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] block mb-1">Strategy Note</span>
                <p className="text-xs leading-relaxed font-semibold">Monitor registration status 45 days prior to cycle launch.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Process & Advisor Grid --- */}
        <section id="process" className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
            <div className="pro-card flex-1">
              <h2 className="text-[11px] font-bold text-ink-700 uppercase tracking-[0.2em] mb-6 sm:mb-10 px-2 opacity-50">Cycle Architecture</h2>
              <div className="space-y-3">
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
            
            <div className="bg-ink-900 rounded-2xl p-8 text-white shadow-2xl overflow-hidden relative border border-white/5">
               <div className="absolute -bottom-6 -right-6 opacity-10 transform scale-150">
                 <Award size={120} />
               </div>
               <h3 className="font-display font-bold text-lg uppercase tracking-tight mb-4">Verified Data Assets</h3>
               <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">Our systems utilize certified datasets from state election boards and federal legislative archives.</p>
               <button className="text-[10px] font-bold uppercase tracking-[0.2em] py-3 border-b-2 border-brand-blue hover:text-brand-blue transition-all">Access Public Records</button>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-8">
            <div id="advisor" className="pro-card p-0 flex flex-col overflow-hidden bg-white/80 backdrop-blur-sm border-brand-blue/5 min-h-[400px] sm:min-h-[500px]" role="region" aria-label="Grounded AI Advisor">
              <div className="p-4 sm:p-5 px-6 sm:px-8 border-b border-surface-200 flex items-center justify-between bg-surface-50/50">
                <h2 className="text-[10px] sm:text-[11px] font-bold text-ink-900 uppercase tracking-[0.2em]">Institutional Advisor</h2>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[11px] font-bold text-ink-700/50 uppercase tracking-widest">Secure Session</span>
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
        <section id="stats" className="pro-card bg-ink-900 border-white/5 p-0 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 border-b border-white/5">
            {[
              { label: "Total Eligible", value: "244.5M", change: "+1.2%" },
              { label: "Early Voters", value: "34.2%", change: "+5.1%" },
              { label: "Wait Variance", value: "12m", change: "-2m avg" },
              { label: "Data Integrity", value: "99.9%", change: "Verified" }
            ].map((stat, i) => (
              <div key={i} className="p-6 sm:p-10 border-r border-b border-white/5 last:border-r-0 md:last:border-b-0 hover:bg-white/[0.02] transition-colors cursor-default group">
                <span className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.25em] block mb-3 sm:mb-4 group-hover:text-brand-blue transition-colors">{stat.label}</span>
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tighter">{stat.value}</span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-green-400 opacity-80">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-black/40 flex flex-col md:flex-row items-center justify-between text-white gap-4">
            <p className="text-xs text-white/40 font-medium">Monitoring Consensus: <span className="text-white font-bold ml-2">Federal General Election Protocol (Standard-2026)</span></p>
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Operational Neural Intelligence</div>
          </div>
        </section>

        {/* --- FAQ grid --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FAQS.map((faq, i) => (
            <div key={i} className="pro-card flex flex-col gap-4 border-brand-blue/5 hover:border-brand-blue/20">
              <h4 className="font-display font-bold text-lg text-ink-900 leading-tight">{faq.question}</h4>
              <p className="text-sm text-ink-700/60 leading-relaxed font-medium">{faq.answer}</p>
            </div>
          ))}
        </section>

        {/* --- CTA Section --- */}
        <section className="noir-gradient rounded-[1.5rem] sm:rounded-[2rem] p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-[0_20px_50px_rgba(2,6,23,0.3)] border border-white/5">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
           <div className="max-w-2xl mx-auto flex flex-col gap-6 sm:gap-8 relative z-10">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight sm:leading-none">Access Global <br className="hidden sm:block"/> Institutional Datasets.</h2>
              <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-lg mx-auto font-medium">Join over 1M+ personnel using Election Pulse AI to optimize civic contribution and monitor local performance.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 sm:mt-6">
                 <input placeholder="Personnel identification..." className="px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl outline-none text-white placeholder:text-white/30 text-sm w-full sm:w-72 focus:bg-white/10 transition-all focus:border-brand-blue/50" />
                 <button className="px-6 sm:px-8 py-3 sm:py-4 bg-brand-blue text-white rounded-xl font-bold shadow-[0_10px_20px_rgba(59,130,246,0.2)] text-sm hover:translate-y-[-2px] hover:shadow-[0_15px_30px_rgba(59,130,246,0.3)] transition-all active:scale-95 w-full sm:w-auto">Link Integration</button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
                 <p className="text-[9px] sm:text-[11px] text-white/20 uppercase tracking-[0.3em] font-bold">Enterprise Governance</p>
                 <div className="hidden sm:block w-1.5 h-1.5 bg-white/10 rounded-full" />
                 <p className="text-[9px] sm:text-[11px] text-white/20 uppercase tracking-[0.3em] font-bold">Non-Partisan Assets</p>
              </div>
           </div>
        </section>
      </main>

      <footer className="bg-white border-t border-surface-200 mt-20 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-4 text-center md:text-left">
          <span className="text-[10px] font-bold text-ink-700/30 uppercase tracking-wider">© 2026 Pulse Intelligence Systems</span>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] font-bold text-ink-700/30 uppercase tracking-wider">
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
