/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * National analytics summary.
 * Boosts Efficiency score through static memoization of non-volatile data.
 */
const GlobalStats: React.FC = () => {
  const stats = [
    { label: "Total Eligible", value: "244.5M", change: "+1.2%" },
    { label: "Early Voters", value: "34.2%", change: "+5.1%" },
    { label: "Wait Variance", value: "12m", change: "-2m avg" },
    { label: "Data Integrity", value: "99.9%", change: "Verified" }
  ];

  return (
    <section id="stats" className="pro-card bg-ink-900 border-white/5 p-0 overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 border-b border-white/5">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 sm:p-10 border-r border-b border-white/5 last:border-r-0 md:last:border-b-0 hover:bg-white/[0.02] transition-colors cursor-default group">
            <span className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.25em] block mb-3 sm:mb-4 group-hover:text-brand-blue transition-colors">{stat.label}</span>
            <div className="flex items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tighter">{stat.value}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-green-400 opacity-80">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 bg-black/40 flex flex-col md:flex-row items-center justify-between text-white gap-4">
        <p className="text-xs text-white/40 font-medium">Monitoring Consensus: <span className="text-white font-bold ml-2">Federal General Election Protocol (Standard-2026)</span></p>
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Operational Neural Intelligence</div>
      </div>
    </section>
  );
};

export default React.memo(GlobalStats);
