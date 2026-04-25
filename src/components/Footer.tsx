/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Institutional Footer.
 * Ensures consistent branding and legal compliance links.
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-surface-200 mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-blue rounded flex items-center justify-center text-white text-[10px] font-bold">E</div>
              <span className="text-lg font-bold tracking-tight text-ink-900">ElectionPulse.ai</span>
           </div>
           <p className="text-xs text-ink-700/50 leading-relaxed">System-wide election intelligence and procedural oversight platform.</p>
        </div>
        {['Research', 'Legal', 'Institutional'].map((col) => (
          <div key={col} className="flex flex-col gap-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-ink-700">{col}</h5>
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => <span key={i} className="text-xs text-ink-700/40 hover:text-brand-blue cursor-pointer transition-colors">Resource Dataset 0{i}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-4 text-center md:text-left">
        <span className="text-[10px] font-bold text-ink-700/30 uppercase tracking-wider">© 2026 Pulse Intelligence Systems</span>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] font-bold text-ink-700/30 uppercase tracking-wider">
          <span>Security Statement</span>
          <span>Policy Protocol</span>
          <span>Data Rights</span>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
