/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface NavbarProps {
  isHighContrast: boolean;
  toggleContrast: () => void;
}

/**
 * Navbar component for institutional navigation and accessibility controls.
 */
const Navbar: React.FC<NavbarProps> = ({ isHighContrast, toggleContrast }) => (
  <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all ${isHighContrast ? 'bg-black border-white text-white' : 'bg-white border-surface-200'}`}>
    <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold transition-transform group-hover:scale-110 ${isHighContrast ? 'bg-white text-black' : 'bg-brand-blue text-white'}`}>E</div>
        <span className={`text-xl font-bold tracking-tight ${isHighContrast ? 'text-white' : 'text-ink-800'} underline-brand`}>ElectionPulse.ai</span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <button 
          onClick={toggleContrast}
          aria-label={isHighContrast ? "Standard mode" : "High contrast mode"}
          className={`p-2 rounded-lg border flex items-center gap-2 transition-all ${isHighContrast ? 'border-white hover:bg-white/10' : 'border-surface-200 hover:bg-surface-50'}`}
        >
          {isHighContrast ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-ink-700/50" />}
          <span className="text-[10px] font-bold uppercase tracking-widest">{isHighContrast ? 'Standard' : 'Contrast'}</span>
        </button>
        <div className={`flex flex-col items-end pr-4 border-r ${isHighContrast ? 'border-white/20' : 'border-surface-200'}`}>
          <span className={`text-[10px] uppercase tracking-widest font-bold ${isHighContrast ? 'text-white/50' : 'text-ink-700/50'}`}>Cycle Status</span>
          <span className="text-xs font-semibold">2026 Midterms • Active</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#process" className="hover:text-brand-blue transition-colors">Process</a>
          <a href="#stats" className="hover:text-brand-blue transition-colors">Insights</a>
          <a href="#assistant" className="text-brand-blue font-bold">AI Advisor</a>
          <button className={`px-4 py-2 text-sm font-medium rounded-md transition-colors shadow-sm ${isHighContrast ? 'bg-white text-black hover:bg-white/90' : 'bg-ink-900 text-white hover:bg-ink-800'}`}>
            Check Status
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default React.memo(Navbar);
