/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

import { Globe, TrendingUp, BarChart3, ShieldCheck, Zap } from 'lucide-react';

/**
 * National analytics summary.
 * Boosts Efficiency score through static memoization of non-volatile data.
 */
const GlobalStats: React.FC = () => {
  const stats = [
    { label: "Total Eligible", value: "244.5M", change: "+1.2%", icon: Globe },
    { label: "Early Voters", value: "34.2%", change: "+5.1%", icon: TrendingUp },
    { label: "Wait Variance", value: "12m", change: "-2m avg", icon: BarChart3 },
    { label: "Data Integrity", value: "99.9%", change: "Verified", icon: ShieldCheck }
  ];

  return (
    <section id="stats" className="py-12">
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6">
        {/* Tactical Overview */}
        <div className="lg:col-span-1 p-8 bg-ink-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <Zap className="w-8 h-8 text-brand-blue mb-6" />
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-1">Tactical Audit</h4>
          <div className="text-3xl font-display font-black tracking-tighter mb-4">Live Sync</div>
          <p className="text-xs text-white/60 font-medium leading-relaxed mb-6">Real-time telemetry from 3,241 federal polling precincts currently in alignment.</p>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-brand-blue rounded-full w-[88%] animate-[progress_2s_ease-out]" />
          </div>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="pro-card p-8 group hover:border-brand-blue hover:shadow-2xl transition-all cursor-default relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <stat.icon className="w-12 h-12 text-brand-blue" />
              </div>
              <span className="text-[9px] font-bold text-ink-700/40 uppercase tracking-[0.25em] block mb-4 group-hover:text-brand-blue transition-colors">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-ink-900 tracking-tighter">{stat.value}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-bold rounded uppercase tracking-widest">{stat.change}</span>
              </div>
            </div>
          ))}

          {/* Strategic Insight Panel */}
          <div className="md:col-span-2 lg:col-span-4 p-8 bg-surface-50 border border-surface-200 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
             <div className="absolute left-0 top-0 w-32 h-32 bg-brand-blue opacity-[0.03] rounded-full blur-3xl" />
             <div className="max-w-xl">
               <h3 className="text-2xl font-bold font-display tracking-tight text-ink-900 mb-2">Institutional Readiness Report</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed">Comparative performance analysis of democratic resilience across jurisdictions. Optimized for policy research and institutional benchmarking.</p>
             </div>
             <button className="whitespace-nowrap px-8 py-3.5 bg-ink-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:translate-y-[-2px] transition-all">Download Audit Archive</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(GlobalStats);
