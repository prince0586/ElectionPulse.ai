/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronUp, ChevronDown, ExternalLink, Calendar } from 'lucide-react';
import { TimelineStep as TimelineStepType } from '../types';
import { getGoogleCalendarLink } from '../utils/calendar';

interface TimelineStepProps {
  step: TimelineStepType;
  index: number;
  total: number;
}

/**
 * Interactive timeline block for procedural guidance.
 * Integrated with Google Calendar for institutional synchronization.
 */
const TimelineStep: React.FC<TimelineStepProps> = ({ step, index, total }) => {
  const [isOpen, setIsOpen] = useState(index === 2); // default open the active one

  const calendarLink = getGoogleCalendarLink(step.title, step.date, step.description);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
            step.status === 'Completed' ? 'bg-green-500 text-white' : 
            step.status === 'Active' ? 'bg-brand-blue text-white shadow-lg' : 
            'bg-surface-100 text-ink-700/30'
          }`}
        >
          {step.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold text-xs">{index + 1}</span>}
        </motion.div>
        {index !== total - 1 && (
          <div className="w-0.5 h-full bg-surface-200 my-2" />
        )}
      </div>
      
      <div 
        id={`timeline-card-${step.id}`} 
        className={`flex-1 pro-card mb-6 last:mb-0 transition-all cursor-pointer ${isOpen ? 'ring-2 ring-brand-blue/5 border-brand-blue/20 shadow-xl' : 'hover:bg-surface-50'}`} 
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step.status === 'Active' ? 'text-brand-blue' : 'text-slate-400'}`}>Stage 0{index + 1} • {step.date}</span>
            <h4 className="text-base sm:text-lg font-bold text-ink-800 mt-1">{step.title}</h4>
          </div>
          <div className="text-ink-700/30 flex items-center gap-2">
             <a 
               href={calendarLink} 
               target="_blank" 
               rel="noopener noreferrer"
               title="Add to Google Calendar"
               onClick={(e) => e.stopPropagation()}
               className="p-1 hover:text-brand-blue transition-colors"
             >
                <Calendar className="w-4 h-4" />
             </a>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-surface-100">
                <p className="text-ink-700/70 text-sm leading-relaxed text-xs">
                  {step.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                  <button className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest bg-ink-900 text-white px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 hover:bg-brand-blue transition-colors">
                    Access Official Protocol <ExternalLink className="w-3 h-3" />
                  </button>
                  <a 
                    href={calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest bg-surface-100 text-ink-700 px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 hover:bg-surface-200 transition-colors"
                  >
                    Sync to Google
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(TimelineStep);
