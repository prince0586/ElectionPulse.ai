/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Vote, ShieldCheck, MapPin, Loader2, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { LocationData } from '../types';

interface HeroSectionProps {
  zipCode: string;
  setZipCode: (val: string) => void;
  location: LocationData | null;
  isLocating: boolean;
  fetchLocation: (zip: string) => void;
}

/**
 * Institutional Hero Section.
 * Centralizes primary call-to-action and localization protocol.
 */
const HeroSection: React.FC<HeroSectionProps> = ({ 
  zipCode, 
  setZipCode, 
  location, 
  isLocating, 
  fetchLocation 
}) => {
  const [countdown, setCountdown] = React.useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  React.useEffect(() => {
    const electionDate = new Date('2026-11-03T07:00:00Z').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = electionDate - now;

      setCountdown({
        days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        mins: Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
        secs: Math.max(0, Math.floor((distance % (1000 * 60)) / 1000))
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await res.json();
        if (data.postcode) {
          setZipCode(data.postcode);
          fetchLocation(data.postcode);
        }
      } catch (e) {
        console.error("Geolocation Resolution Error:", e);
      }
    });
  };

  return (
    <section id="hero-grid" className="col-span-12 lg:col-span-8 flex flex-col gap-6 sm:gap-8">
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
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.1] sm:leading-[0.95] mb-6 tracking-tight text-ink-900">
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
            <div className="p-5 sm:p-6 rounded-2xl bg-surface-100 border border-surface-200/50 group/timer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover/timer:opacity-10 transition-opacity">
                 <ShieldCheck className="w-12 h-12 text-brand-blue" />
              </div>
              <h4 className="text-[10px] sm:text-[11px] font-bold text-ink-700 uppercase tracking-[0.2em] mb-4">Precision Cycle Tracker</h4>
              <div className="flex gap-4">
                {[
                  { label: 'D', value: countdown.days },
                  { label: 'H', value: countdown.hours },
                  { label: 'M', value: countdown.mins }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-display font-black text-ink-900 leading-none">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[8px] font-bold text-ink-700/40 uppercase tracking-widest mt-1">{item.label}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-display font-black text-brand-blue leading-none animate-pulse">
                    {countdown.secs.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[8px] font-bold text-brand-blue/40 uppercase tracking-widest mt-1">S</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-100 flex flex-col sm:flex-row items-center gap-5">
             <div className="relative flex-1 group w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-700/30 group-focus-within:text-brand-blue transition-colors" />
                <input 
                  type="text" 
                  maxLength={10}
                  value={zipCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setZipCode(val);
                  }}
                  placeholder="Enter location code (e.g. 110001 or 90210)..."
                  className="w-full bg-surface-50 border border-surface-200 py-4 pl-12 pr-[100px] rounded-xl outline-none focus:border-brand-blue/30 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.05)] text-sm font-medium placeholder:text-ink-700/30 transition-all"
                  aria-label="Localization Zip Code"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   {isLocating && <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />}
                   <motion.button 
                     onClick={detectLocation}
                     whileHover={{ scale: 1.1, rotate: 15 }}
                     whileTap={{ scale: 0.9 }}
                     className="p-1.5 text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                     title="Detect my location"
                   >
                      <Navigation className="w-4 h-4" />
                   </motion.button>
                </div>
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
    </section>
  );
};

export default React.memo(HeroSection);
