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
  Area 
} from 'recharts';
import { VOTER_TRENDS } from '../constants';

/**
 * Historical turnout trends visualization.
 * Uses institution branding and precision charts for deep performance insights.
 */
const HistoricalPulse: React.FC = () => {
  return (
    <div className="pro-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">Historical Pulse</h3>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-ink-700/50">Voter Turnout Trends (%)</p>
            <span className="text-[8px] bg-green-500/10 text-green-600 px-1 rounded border border-green-500/20 font-bold uppercase tracking-tighter">Verified Audit</span>
          </div>
        </div>
        <TrendingUp className="w-5 h-5 text-brand-blue" aria-hidden="true" />
      </div>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={VOTER_TRENDS}>
            <defs>
              <linearGradient id="colorTurnout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
            <XAxis dataKey="year" hide />
            <YAxis hide domain={[40, 80]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '10px' }}
            />
            <Area type="monotone" dataKey="turnout" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorTurnout)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 pt-6 border-t border-surface-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-ink-700/40 uppercase">2026 Forecast</span>
          <span className="text-lg font-extrabold text-brand-blue tracking-tighter">62.4%</span>
        </div>
        <button className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:underline">Full Report &rarr;</button>
      </div>
    </div>
  );
};

export default React.memo(HistoricalPulse);
