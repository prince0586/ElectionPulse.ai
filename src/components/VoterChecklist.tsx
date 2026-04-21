/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Download, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { ChecklistItem } from '../types';
import { INITIAL_CHECKLIST } from '../constants';

/**
 * Personal protocol checklist for voter preparedness.
 */
const VoterChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('voter_checklist');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  useEffect(() => {
    localStorage.setItem('voter_checklist', JSON.stringify(items));
  }, [items]);

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
      
      <div className="flex-1 p-6 space-y-3 overflow-y-auto custom-scrollbar">
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

export default React.memo(VoterChecklist);
