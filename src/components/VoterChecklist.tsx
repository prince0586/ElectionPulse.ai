/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ShieldCheck, CheckCircle2, Download, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useChecklist } from '../hooks/useChecklist';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getGoogleCalendarLink } from '../utils/calendar';

/**
 * Personal protocol checklist for voter preparedness.
 * Efficiency-optimized through memoization and targeted re-renders.
 */
const VoterChecklist: React.FC = () => {
  const { items, toggleItem, isSyncing, user, loadingAuth } = useChecklist();

  const handleSignIn = useCallback(() => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(console.error);
  }, []);

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
        </div>
      </div>
      
      <div className="flex-1 p-6 sm:p-8 space-y-4 overflow-y-auto custom-scrollbar relative z-10">
        {checklistItems}
      </div>
      
      <div className="p-6 sm:p-8 bg-black/20 border-t border-white/5 flex gap-3 relative z-10">
        <button className="flex-1 py-3 px-4 bg-brand-blue text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2.5 hover:translate-y-[-2px] transition-all shadow-lg active:scale-95">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
        <button 
          onClick={() => {
            const link = getGoogleCalendarLink('Voter Registration Renewal', 'Month -1', 'Ensure your registration is still active and correct.');
            window.open(link, '_blank');
          }}
          className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2.5 hover:bg-white/5 transition-all text-white active:scale-95"
        >
          <Calendar className="w-3.5 h-3.5" /> Reminders
        </button>
      </div>
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
    onClick={() => onToggle(item.id)}
    className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-white/5 cursor-pointer transition-all duration-300 group hover:translate-x-1"
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
