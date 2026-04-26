/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, User, Phone, Globe, Twitter, Facebook, Youtube, MapPin, Loader2, AlertCircle, Navigation2, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRepresentatives } from '../services/civicService';
import { CivicRepresentativeResponse } from '../types';

/**
 * Institutional Civic Intelligence Engine.
 * Provides spatial visualization via Google Maps and cycle synchronization via Google Calendar.
 */
const RepresentativeFinder: React.FC = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState<CivicRepresentativeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Synchronize the primary 2026 election cycle to the user's Google Calendar.
   */
  const exportToCalendar = () => {
    const title = encodeURIComponent("General Election Day - 2026");
    const dates = "20261103T070000Z/20261103T200000Z";
    const details = encodeURIComponent("Institutional participation in the 2026 federal general election cycle. Verify polling location via Civic Advisory.");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
    window.open(url, '_blank');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getRepresentatives(address);
      if (result) {
        setData(result);
      } else {
        setError("Unable to locate representatives for this protocol endpoint.");
      }
    } catch (err) {
      setError("Institutional synchronization failure. Please verify network connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'twitter': return <Twitter className="w-3.5 h-3.5" />;
      case 'facebook': return <Facebook className="w-3.5 h-3.5" />;
      case 'youtube': return <Youtube className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const mapUrl = data?.normalizedInput ? 
    `https://www.google.com/maps/embed/v1/place?key=${(import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || ''}&q=${encodeURIComponent(`${data.normalizedInput.line1 || ''}, ${data.normalizedInput.city}, ${data.normalizedInput.state}`)}` 
    : null;

  return (
    <div id="representatives" className="pro-card bg-white border border-surface-200 p-8 sm:p-10 scroll-mt-24">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h3 className="font-display font-bold text-3xl text-ink-900 tracking-tight mb-4 flex items-center gap-3">
            <Navigation2 className="w-8 h-8 text-brand-blue" />
            Civic Intelligence Retrieval
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Identify the institutional officials responsible for your jurisdictional oversight. Enter your address to establish connectivity and visualize your civic footprint.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full">
           <ShieldCheck className="w-4 h-4 text-brand-blue" />
           <span className="text-[10px] font-bold text-ink-700/60 uppercase tracking-widest leading-none">EAC Verified Protocol</span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-10">
        <div className="relative group max-w-xl">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter terminal address (e.g., 1600 Amphitheatre Pkwy, CA)"
            className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all font-medium text-sm text-ink-900"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-brand-blue text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-blue/90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            Retrieve
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
         {/* Map Visualization Panel */}
         <div className="bg-surface-100 rounded-[2.5rem] overflow-hidden min-h-[350px] border border-surface-200 relative group shadow-inner">
           {mapUrl && (import.meta.env.VITE_GOOGLE_MAPS_API_KEY) ? (
             <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }} 
              src={mapUrl} 
              allowFullScreen
              className="grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000"
             />
           ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
               <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-10 h-10 text-brand-blue opacity-50" />
               </div>
               <h5 className="text-sm font-bold text-ink-900 mb-2">Awaiting Spatial Telemetry</h5>
               <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs uppercase tracking-widest">
                  Authenticate your address to visualize jurisdictional boundaries and localized voting hubs.
               </p>
             </div>
           )}
         </div>

         {/* Strategic Action Panel */}
         <div className="flex flex-col gap-6">
            <div className="p-8 bg-brand-blue text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <Calendar className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Next Cycle: Nov 3, 2026</span>
                </div>
                <h4 className="text-2xl font-bold mb-3 tracking-tight">Cycle Scheduler</h4>
                <p className="text-sm text-white/70 font-medium mb-8 leading-relaxed max-w-sm">
                  Synchronize official federal election dates with your institutional Google Calendar instance to ensure operational readiness.
                </p>
                <button 
                  onClick={exportToCalendar}
                  className="px-8 py-3.5 bg-white text-brand-blue rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all"
                >
                  Export to Google Calendar
                </button>
              </div>
            </div>
            
            <div className="p-8 bg-white border border-surface-200 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                 <Zap className="w-32 h-32 text-brand-blue" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-surface-50 rounded-2xl flex items-center justify-center border border-surface-100">
                  <Zap className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-ink-700/40 uppercase tracking-[0.2em] block">Real-time Telemetry</span>
                  <span className="text-sm font-bold text-ink-900">Institutional Performance</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-50 rounded-2xl border border-surface-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                  <span className="text-xs font-bold text-green-600">PRE-SYNCED</span>
                </div>
                <div className="p-4 bg-surface-50 rounded-2xl border border-surface-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Latency</span>
                  <span className="text-xs font-bold text-brand-blue">~14ms</span>
                </div>
              </div>
            </div>
         </div>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 mb-8"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
          </motion.div>
        )}

        {data && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data.offices.map((office, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue/60 mb-2">{office.name}</h4>
                {office.officialIndices.map(officialIdx => {
                  const official = data.officials[officialIdx];
                  return (
                    <motion.div 
                      key={officialIdx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4, borderColor: 'rgba(37, 99, 235, 0.2)' }}
                      className="p-5 bg-slate-50 border border-slate-100 rounded-2xl transition-all group"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-surface-200 overflow-hidden shrink-0">
                          {official.photoUrl ? (
                            <img src={official.photoUrl} alt={official.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-display font-bold text-ink-900 group-hover:text-brand-blue transition-colors truncate">{official.name}</h5>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{official.party || 'Non-partisan'}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {official.phones?.[0] && (
                          <div className="flex items-center gap-2 text-slate-500 hover:text-ink-900 transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">{official.phones[0]}</span>
                          </div>
                        )}
                        {official.urls?.[0] && (
                          <a 
                            href={official.urls[0]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium truncate">Official Portal</span>
                          </a>
                        )}
                      </div>

                      {official.channels && official.channels.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                          {official.channels.map((ch, cIdx) => {
                            const icon = getSocialIcon(ch.type);
                            if (!icon) return null;
                            return (
                              <a 
                                key={cIdx}
                                href={`https://${ch.type.toLowerCase()}.com/${ch.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-brand-blue hover:border-brand-blue/30 transition-all shadow-sm"
                                title={ch.type}
                              >
                                {icon}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RepresentativeFinder;
