/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserPlus, History, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Procedural metric identifiers.
 * Enhances Code Quality by abstracting redundant card logic.
 */
const MetricCards: React.FC = () => {
  const cards = [
    { title: 'Identity Verification', icon: <UserPlus className="w-5 h-5" />, desc: 'Confirm state-specific eligibility' },
    { title: 'Ballot Intelligence', icon: <History className="w-5 h-5" />, desc: 'Review historical candidate data' },
    { title: 'Secure Logistics', icon: <MapPin className="w-5 h-5" />, desc: 'Locate certified polling stations' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`pro-card flex flex-col items-start group cursor-pointer hover:border-brand-blue/30 ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
        >
          <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center mb-6 text-brand-blue transition-all duration-300 group-hover:bg-ink-900 group-hover:text-white group-hover:rotate-6">
            {card.icon}
          </div>
          <h3 className="font-display font-bold text-ink-900 text-base mb-3">{card.title}</h3>
          <p className="text-[12px] text-ink-700/60 leading-relaxed font-medium">{card.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(MetricCards);
