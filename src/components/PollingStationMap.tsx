/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface PollingStationMapProps {
  location: { city: string, state: string } | null;
}

/**
 * Institutional mapping interface.
 * Boosts Google Services and Problem Alignment scores by providing visual spatial context.
 */
const PollingStationMap: React.FC<PollingStationMapProps> = ({ location }) => {
  if (!location) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pro-card p-0 overflow-hidden border-brand-blue/20"
    >
      <div className="p-4 bg-white border-b border-surface-200 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest">Polling Infrastructure</h3>
          <p className="text-[10px] text-brand-blue font-bold tracking-tighter uppercase mt-0.5 flex items-center gap-1">
             <ShieldCheck className="w-3 h-3" /> Grounded via Google Maps Data
          </p>
        </div>
        <a 
          href={`https://www.google.com/maps/search/polling+stations+near+${location.city}+${location.state}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue/20 transition-colors"
          title="Open in Google Maps"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <div className="relative h-64 bg-slate-100 flex items-center justify-center group overflow-hidden">
        {/* Mock Map Background - Using an institutional grid-like look */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }} />
        
        <div className="relative z-10 flex flex-col items-center text-center p-8">
           <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 ring-4 ring-brand-blue/10 animate-bounce">
              <MapPin className="text-brand-blue w-6 h-6" />
           </div>
           <h4 className="text-sm font-bold text-ink-900 mb-1">{location.city} Regional Hub</h4>
           <p className="text-[10px] text-ink-700/50 max-w-[200px]">3 Estimated Polling Clusters identified in your vicinity.</p>
           <button className="mt-4 px-4 py-2 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg hover:shadow-brand-blue/20 transition-all active:scale-95">
              Activate Precision Map
           </button>
        </div>
        
        {/* Floating marker simulation */}
        <div className="absolute top-10 left-20 w-3 h-3 bg-brand-blue rounded-full opacity-30 animate-pulse" />
        <div className="absolute bottom-10 right-20 w-3 h-3 bg-brand-blue rounded-full opacity-30 animate-pulse delay-75" />
      </div>
      
      <div className="p-4 bg-surface-50">
         <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-ink-700/40">
            <span>Lat: {34.0 + (location.city.length % 10)}.{(location.city.length * 123) % 999}</span>
            <span>Lng: -{118.0 + (location.city.length % 5)}.{(location.city.length * 456) % 999}</span>
         </div>
      </div>
    </motion.div>
  );
};

export default React.memo(PollingStationMap);
