/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { 
  Vote, 
  Loader2, 
  ShieldCheck,
  Lightbulb,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React from 'react';

// --- Internal Modules ---
import { LocationData } from './types';
import { 
  TIMELINE_DATA, 
  THEMES,
  ThemeType
} from './constants';
import { getGoogleCalendarLink } from './utils/calendar';

// --- Components ---
import Navbar from './components/Navbar';
import ChatAssistant from './components/ChatAssistant';
import TimelineStep from './components/TimelineStep';
import VoterChecklist from './components/VoterChecklist';
import LocalMetrics from './components/LocalMetrics';
import HeroSection from './components/HeroSection';
import MetricCards from './components/MetricCards';
import GlobalStats from './components/GlobalStats';
import FAQSection from './components/FAQSection';
import RepresentativeFinder from './components/RepresentativeFinder';
import ErrorBoundary from './components/ErrorBoundary';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';

// --- Lazy Components ---
const HistoricalPulse = lazy(() => import('./components/HistoricalPulse'));
const PollingStationMap = lazy(() => import('./components/PollingStationMap'));

import { getVoterInfo } from './services/civicService';

export default function App() {
  const [zipCode, setZipCode] = useState('');
  const [debouncedZip, setDebouncedZip] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [civicData, setCivicData] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('minimal');
  const [dailyTip, setDailyTip] = useState("Research local ballot measures to understand community impact.");
  const [view, setView] = useState<'home' | 'profile'>('home');

  // Apply theme-specific typography and variables to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-institutional', 'theme-brutalist', 'theme-minimal', 'theme-editorial');
    root.classList.add(`theme-${theme}`);
    root.style.setProperty('--theme-transition', '0.5s');
  }, [theme]);

  const tips = useMemo(() => [
    "Check registration status 45 days before the cycle.",
    "Verify polling station locations 48 hours before voting.",
    "Review official sample ballots to save time at the booth.",
    "Ensure identification documents meet state-specific criteria."
  ], []);

  useEffect(() => {
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  }, [tips]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedZip(zipCode);
    }, 400);
    return () => clearTimeout(handler);
  }, [zipCode]);

  const fetchLocation = useCallback(async (zip: string) => {
    if (zip.length < 5 || zip.length > 10) return;
    setIsLocating(true);
    try {
      // First attempt with US zippopotam (default)
      let res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      
      // If not found and zip length is 6, try India (common request)
      if (!res.ok && zip.length === 6) {
        res = await fetch(`https://api.zippopotam.us/in/${zip}`);
      }

      if (res.ok) {
        const data = await res.json();
        const place = data.places[0];
        setLocation({
          city: place['place name'],
          state: place.state || place['state abbreviation'],
          zipCode: zip
        });
      }
    } catch (e) {
      console.error("Institutional Localization Error:", e);
    } finally {
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedZip.length >= 5 && debouncedZip.length <= 10) {
      fetchLocation(debouncedZip);
      getVoterInfo(debouncedZip)
        .then(setCivicData)
        .catch(err => console.error("Institutional Civic Sync Failure:", err));
    }
  }, [debouncedZip, fetchLocation]);

  const handleSyncAll = () => {
    // Strategic Sync: Open primary registration event as a test, 
    // or batch sync logic if supported by user calendar.
    const firstEvent = TIMELINE_DATA[0];
    const link = getGoogleCalendarLink(firstEvent.title, firstEvent.date, firstEvent.description);
    window.open(link, '_blank');
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen transition-all duration-500 overflow-x-hidden ${isHighContrast ? 'bg-surface-50 high-contrast' : 'bg-surface-50 font-sans'}`}>
        <a 
          href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-brand-blue text-white rounded font-bold"
      >
        Skip to Content
      </a>
        <Navbar 
          isHighContrast={isHighContrast} 
          toggleContrast={() => setIsHighContrast(!isHighContrast)} 
          currentTheme={theme}
          setTheme={setTheme}
          onProfileClick={() => setView('profile')}
        />

      <main id="main-content" className="pt-20 sm:pt-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-8 sm:gap-10">
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8 sm:gap-10"
            >
              {/* --- Hero Section: Status Overview --- */}
              <section id="hero-grid" className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8">
                <HeroSection 
                  zipCode={zipCode}
                  setZipCode={setZipCode}
                  location={location}
                  isLocating={isLocating}
                  fetchLocation={fetchLocation}
                />

                <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
                  <VoterChecklist location={location} />
                  
                  {location && <LocalMetrics location={location} civicData={civicData} />}
                  
                  <Suspense fallback={<div className="pro-card animate-pulse h-[300px] bg-surface-100" />}>
                    <HistoricalPulse />
                  </Suspense>
                  
                  <Suspense fallback={<div className="pro-card animate-pulse h-[400px] bg-surface-100" />}>
                    {location && <PollingStationMap location={location} civicData={civicData} />}
                  </Suspense>
                  
                  <div className="pro-accent-card flex items-center gap-4 sm:gap-5 relative overflow-hidden noir-gradient">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                    <div className="bg-white/10 p-3 rounded-xl text-white backdrop-blur-sm border border-white/10">
                      <Lightbulb size={24} />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] block mb-1">Institutional Guideline</span>
                      <p className="text-xs leading-relaxed font-semibold">{dailyTip}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* --- Secondary Context Cards --- */}
              <MetricCards />

              {/* --- Process & Advisor Grid --- */}
              <section id="process" className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8">
                <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-8">
                  <div className="pro-card flex-1">
                    <div className="flex items-center justify-between mb-6 sm:mb-10 px-2">
                      <h2 className="text-[11px] font-bold text-ink-700 uppercase tracking-[0.2em] opacity-50">Cycle Architecture</h2>
                      <button 
                        onClick={handleSyncAll}
                        className="flex items-center gap-2 text-[9px] font-bold text-brand-blue uppercase tracking-widest hover:bg-brand-blue/5 px-2 py-1 rounded transition-colors"
                        title="Sync timeline to Google Calendar"
                      >
                        <Calendar className="w-3 h-3" /> Sync All
                      </button>
                    </div>
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
                  
                  <div className="bg-ink-900 rounded-2xl p-8 text-white shadow-2xl overflow-hidden relative border border-white/5 group">
                    <div className="absolute -bottom-6 -right-6 opacity-10 transform scale-150 group-hover:scale-[1.6] transition-transform duration-700">
                      <Vote size={120} />
                    </div>
                    <h3 className="font-display font-bold text-lg uppercase tracking-tight mb-4">Certified Data Sync</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">Our neural systems utilize verified datasets from federal legislative archives and state boards.</p>
                    <button className="text-[10px] font-bold uppercase tracking-[0.2em] py-3 border-b-2 border-brand-blue hover:text-brand-blue transition-all">Audit Governance Records</button>
                  </div>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-8">
                  <ChatAssistant 
                    location={location ? `${location.city}, ${location.state}` : undefined} 
                    zipCode={zipCode}
                  />
                </div>
              </section>

              {/* --- Global Metrics Overview --- */}
              <GlobalStats />

              {/* --- Representative Finder --- */}
              <section id="reps" className="max-w-7xl mx-auto w-full">
                <RepresentativeFinder />
              </section>

              {/* --- FAQ grid --- */}
              <FAQSection />

              {/* --- CTA Section --- */}
              <section className="noir-gradient rounded-[1.5rem] sm:rounded-[2rem] p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-[0_20px_50px_rgba(2,6,23,0.3)] border border-white/5">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
                <div className="max-w-2xl mx-auto flex flex-col gap-6 sm:gap-8 relative z-10">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight sm:leading-none">Establish Global <br className="hidden sm:block"/> Registry Presence.</h2>
                    <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-lg mx-auto font-medium">Coordinate with personnel across multiple jurisdictions. Optimized for institutional oversight and protocol-driven engagement.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 sm:mt-6">
                        <input placeholder="Enter Secure Personnel ID..." className="px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl outline-none text-white placeholder:text-white/30 text-sm w-full sm:w-72 focus:bg-white/10 transition-all focus:border-brand-blue/50" />
                        <button className="px-6 sm:px-8 py-3 sm:py-4 bg-brand-blue text-white rounded-xl font-bold shadow-[0_10px_20px_rgba(59,130,246,0.2)] text-sm hover:translate-y-[-2px] hover:shadow-[0_15px_30px_rgba(59,130,246,0.3)] transition-all active:scale-95 w-full sm:w-auto">Link Instance</button>
                    </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <UserProfile 
              key="profile"
              onBack={() => setView('home')} 
              isHighContrast={isHighContrast}
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  </ErrorBoundary>
  );
}
