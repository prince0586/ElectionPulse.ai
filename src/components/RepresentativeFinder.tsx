/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, User, Phone, Globe, Twitter, Facebook, Youtube, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRepresentatives } from '../services/civicService';
import { CivicRepresentativeResponse, CivicOffice, CivicOfficial } from '../types';

/**
 * Institutional component for discovering elected representatives by address.
 */
const RepresentativeFinder: React.FC = () => {
  const [address, setAddress] = useState('');
  const [data, setData] = useState<CivicRepresentativeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div id="representatives" className="pro-card bg-white border border-surface-200 p-8 sm:p-10">
      <div className="mb-10 max-w-2xl">
        <h3 className="font-display font-bold text-3xl text-ink-900 tracking-tight mb-4">Personnel Directory</h3>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
          Identify the institutional officials responsible for your jurisdictional oversight. Enter your address to establish connectivity.
        </p>
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
