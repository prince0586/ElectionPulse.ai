/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  TooltipProps
} from 'recharts';
import { VOTER_TRENDS } from '../constants';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ink-900 text-white p-3 rounded-lg border border-white/10 shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-1">{label} Election</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold">{payload[0].value}%</span>
          <span className="text-[9px] font-medium text-white/60">Institutional Turnout</span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Historical turnout trends visualization.
 * Uses institution branding and precision charts for deep performance insights.
 */
const HistoricalPulse: React.FC = () => {
  return (
    <div className="pro-card flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">Historical Pulse</h3>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-ink-700/50">Voter Turnout Trends (%)</p>
            <span className="text-[8px] bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded border border-brand-blue/20 font-bold uppercase tracking-tighter">Verified Audit</span>
          </div>
        </div>
        <div className="p-2 bg-surface-50 rounded-xl border border-surface-200">
          <TrendingUp className="w-4 h-4 text-brand-blue" aria-hidden="true" />
        </div>
      </div>
      <div className="flex-1 min-h-[220px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={VOTER_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTurnout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#cbd5e1" opacity={0.3} />
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              domain={[45, 75]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="turnout" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorTurnout)" 
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: '#3b82f6' }}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 pt-6 border-t border-surface-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-ink-700/40 uppercase tracking-widest leading-none mb-1">Analytical Projection</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-ink-900 tracking-tighter">62.4%</span>
            <span className="text-[10px] font-bold text-brand-blue">+2.3% YoY</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-ink-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-ink-800 transition-all shadow-md active:scale-95">
          Deep Audit
        </button>
      </div>
    </div>
  );
};

export default React.memo(HistoricalPulse);
