/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ShieldCheck, CheckCircle2, Download, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useChecklist } from '../hooks/useChecklist';
import { auth } from '../lib/firebase';
import { getGoogleCalendarLink } from '../utils/calendar';
import { LocationData } from '../types';
import { processAdvisorQuery } from '../services/aiService';
import AuthOverlay from './AuthOverlay';

interface VoterChecklistProps {
  location: LocationData | null;
}

/**
 * Personal protocol checklist for voter preparedness.
 * Efficiency-optimized through memoization and targeted re-renders.
 */
const VoterChecklist: React.FC<VoterChecklistProps> = ({ location }) => {
  const { items, toggleItem, isSyncing, user, loadingAuth } = useChecklist();
  const [showAuth, setShowAuth] = useState(false);
  const [localInfo, setLocalInfo] = useState<{ requirements: string; link: string; deadline: string } | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  const handleSignIn = useCallback(() => {
    setShowAuth(true);
  }, []);

  useEffect(() => {
    async function fetchLocalRegistration() {
      if (!location?.state) {
        setLocalInfo(null);
        return;
      }
      
      setIsLoadingInfo(true);
      try {
        const query = `Provide current voter registration requirements, the official registration link, and upcoming deadlines for the state of ${location.state}. 
        Format your response precisely as:
        REQUIREMENTS: [brief list]
        LINK: [URL]
        DEADLINE: [date info]`;
        
        const advisorResponse = await processAdvisorQuery(query, []);
        const content = advisorResponse.content || "";
        
        const requirementsMatch = content.match(/REQUIREMENTS:\s*([\s\S]*?)(?=LINK:|$)/i);
        const linkMatch = content.match(/LINK:\s*(https?:\/\/[^\s]+)/i);
        const deadlineMatch = content.match(/DEADLINE:\s*([\s\S]*?)(?=$)/i);
        
        if (requirementsMatch || linkMatch || deadlineMatch) {
          setLocalInfo({
            requirements: requirementsMatch?.[1]?.trim() || "Requirements not synthesized.",
            link: linkMatch?.[1]?.trim() || "https://vote.gov",
            deadline: deadlineMatch?.[1]?.trim() || "Refer to state portal."
          });
        }
      } catch (err) {
        console.error("Local Registration Sync Error:", err);
      } finally {
        setIsLoadingInfo(false);
      }
    }

    fetchLocalRegistration();
  }, [location?.state]);

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round((items.filter(i => i.checked).length / items.length) * 100);
  }, [items]);

  const checklistItems = useMemo(() => (
    items.map(item => (
      <ChecklistItemRow 
        key={item.id} 
        item={item} 
        onToggle={toggleItem} 
      />
    ))
  ), [items, toggleItem]);

  return (
    <div id="voter-readiness-checklist" className="pro-card bg-ink-900 border-none text-white overflow-hidden flex flex-col h-full shadow-[0_20px_50px_rgba(2,6,23,0.4)] relative border border-white/5" role="region" aria-label="Readiness Checklist">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="p-6 sm:p-8 border-b border-white/5 relative z-10">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Personnel Protocol</h3>
           {isSyncing ? (
             <div className="flex items-center gap-2.5">
               <div className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
               <span className="text-[10px] font-bold text-brand-blue uppercase tracking-tight">Syncing</span>
             </div>
           ) : (
             <ShieldCheck className={`w-5 h-5 ${user ? 'text-green-500' : 'text-white/20'}`} />
           )}
        </div>
        <h4 className="text-xl font-display font-bold mb-1 tracking-tight text-white">Voter Readiness</h4>
        <div className="w-full bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden">
           <motion.div 
             className="bg-brand-blue h-full shadow-[0_0_12px_rgba(59,130,246,0.3)]"
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
             transition={{ duration: 1, ease: "circOut" }}
           />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-[11px] font-bold text-brand-blue uppercase tracking-widest">{progress}% Operational Readiness</p>
          {!user && !loadingAuth && (
            <button 
              onClick={handleSignIn}
              className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-[0.1em] underline underline-offset-4 transition-all"
            >
              Sign-in to Sync
            </button>
          )}
          {user && !user.emailVerified && (
            <button 
              onClick={handleSignIn}
              className="text-[10px] font-bold text-brand-crimson hover:text-red-400 uppercase tracking-[0.1em] underline underline-offset-4 transition-all"
            >
              Verify Identity
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-6 sm:p-8 space-y-4 overflow-y-auto custom-scrollbar relative z-10">
        {checklistItems}

        <AnimatePresence>
          {location && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">Localized Protocol: {location.state}</h5>
                {isLoadingInfo && <div className="w-3 h-3 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />}
              </div>
              
              {localInfo ? (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                  <div>
                    <span className="text-[9px] font-bold text-white/40 uppercase block mb-1">State Requirements</span>
                    <p className="text-xs text-white/80 leading-snug">{localInfo.requirements}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-[9px] font-bold text-white/40 uppercase block mb-1">Next Deadline</span>
                      <p className="text-xs font-bold text-brand-blue">{localInfo.deadline}</p>
                    </div>
                    <a 
                      href={localInfo.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/20 rounded-lg text-[10px] font-bold text-brand-blue transition-all"
                    >
                      Official Portal
                    </a>
                  </div>
                </div>
              ) : !isLoadingInfo ? (
                <p className="text-[11px] text-white/40 italic">Synthesizing state-specific registration data...</p>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-6 sm:p-8 bg-black/20 border-t border-white/5 flex gap-3 relative z-10">
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-3 px-4 bg-brand-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2.5 transition-all shadow-lg"
        >
          <Download className="w-3.5 h-3.5" /> Export
        </motion.button>
        <motion.button 
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const link = getGoogleCalendarLink('Voter Registration Renewal', 'Month -1', 'Ensure your registration is still active and correct.');
            window.open(link, '_blank');
          }}
          className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2.5 transition-all text-white"
        >
          <Calendar className="w-3.5 h-3.5" /> Reminders
        </motion.button>
      </div>

      <AnimatePresence>
        {showAuth && (
          <AuthOverlay onClose={() => setShowAuth(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

interface ChecklistItemRowProps {
  item: any;
  onToggle: (id: string) => void;
}

/**
 * Individual checklist row, memoized to prevent re-rendering when other items change.
 */
const ChecklistItemRow: React.FC<ChecklistItemRowProps> = React.memo(({ item, onToggle }) => (
  <motion.div 
    initial={{ opacity: 0, x: -5 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onToggle(item.id)}
    className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 cursor-pointer transition-all duration-300 group shadow-sm"
  >
    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-300 ${item.checked ? 'bg-brand-blue border-brand-blue rotate-12 scale-110 shadow-lg' : 'border-white/10 group-hover:border-white/30'}`}>
      {item.checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
    </div>
    <span className={`text-[13px] font-semibold transition-all duration-300 ${item.checked ? 'text-white/30 line-through' : 'text-white/80'}`}>
      {item.text}
    </span>
  </motion.div>
));

export default React.memo(VoterChecklist);
