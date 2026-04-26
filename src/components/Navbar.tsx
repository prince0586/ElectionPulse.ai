/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, EyeOff, Palette, Menu, X } from 'lucide-react';
import { ThemeType, THEMES } from '../constants.tsx';

interface NavbarProps {
  isHighContrast: boolean;
  toggleContrast: () => void;
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

/**
 * Navbar component for institutional navigation and accessibility controls.
 * Updated with mobile menu for full responsive accessibility.
 */
const Navbar: React.FC<NavbarProps> = ({ isHighContrast, toggleContrast, currentTheme, setTheme }) => {
  const [showThemePicker, setShowThemePicker] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isHighContrast ? 'bg-surface-50 border-ink-900 text-ink-900 shadow-lg' : 'bg-white/80 backdrop-blur-xl border-surface-200 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0">
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-display font-bold transition-all duration-300 group-hover:rotate-12 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] ${isHighContrast ? 'bg-ink-900 text-surface-50' : 'bg-ink-900 text-white'}`}>E</div>
          <span className={`text-base sm:text-lg md:text-xl font-display font-bold tracking-tight ${isHighContrast ? 'text-ink-900' : 'text-ink-900'} underline-brand whitespace-nowrap`}>ElectionPulse.ai</span>
        </div>

        {/* Right Side: Responsive Actions & Info */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {/* Desktop/Tablet Stats */}
          <div className="hidden md:flex flex-col items-end shrink-0 px-4 border-r border-surface-200">
            <span className={`text-[9px] uppercase tracking-[0.2em] font-bold mb-0.5 ${isHighContrast ? 'text-ink-700' : 'text-ink-700/40'}`}>Cycle Status</span>
            <span className="text-[10px] font-bold tracking-tight">2026 Midterms</span>
          </div>

          {/* Core Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowThemePicker(!showThemePicker)}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-2 transition-all shrink-0 ${isHighContrast ? 'border-ink-900 hover:bg-ink-900/10' : 'border-surface-200 hover:border-brand-blue/30 bg-surface-50/50'}`}
                aria-label="Change application design theme"
              >
                <Palette className="w-4 h-4 text-brand-blue" />
                <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-[0.2em]">Protocol</span>
              </button>
              
              {showThemePicker && (
                <div className={`absolute top-full right-0 mt-2 w-64 p-3 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-top-2 duration-200 ${isHighContrast ? 'bg-surface-50 border-ink-900' : 'bg-white border-surface-100'}`}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 px-2">Design Protocol Preview</p>
                  <div className="space-y-1">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setTheme(theme.id);
                          setShowThemePicker(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-0.5 ${currentTheme === theme.id ? (isHighContrast ? 'bg-ink-900 text-surface-50' : 'bg-brand-blue/10 text-brand-blue') : (isHighContrast ? 'hover:bg-ink-900/10' : 'hover:bg-surface-50')}`}
                      >
                        <span className="text-xs font-bold">{theme.name}</span>
                        <span className="text-[10px] opacity-60 leading-tight">{theme.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={toggleContrast}
              aria-label={isHighContrast ? "Standard mode" : "High contrast mode"}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-2 transition-all shrink-0 ${isHighContrast ? 'border-ink-900 hover:bg-ink-900/10' : 'border-surface-200 hover:border-brand-blue/30 bg-surface-50/50'}`}
            >
              {isHighContrast ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-ink-700/50" />}
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.2em]">{isHighContrast ? 'Standard' : 'Contrast'}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl border transition-all ${isHighContrast ? 'border-ink-900' : 'border-surface-200'}`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-brand-blue" />}
            </button>
          </div>

          {/* Desktop Only Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8 shrink-0">
            <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-ink-700/60 transition-all">
              <a href="#process" className="hover:text-brand-blue">Process</a>
              <a href="#stats" className="hover:text-brand-blue">Insights</a>
            </nav>
            <button className={`px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 shrink-0 ${isHighContrast ? 'bg-brand-blue text-white hover:bg-brand-blue/90' : 'bg-ink-900 text-white hover:bg-ink-800'}`}>
              Audit Personnel
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t animate-in slide-in-from-top duration-300 ${isHighContrast ? 'bg-surface-50 border-ink-900' : 'bg-white border-surface-100'}`}>
          <div className="px-4 py-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1 px-4 mb-4">
              <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${isHighContrast ? 'text-ink-700' : 'text-slate-400'}`}>Cycle Status</span>
              <span className="text-sm font-bold">2026 Midterms • Active Sync</span>
            </div>
            <nav className="flex flex-col gap-2">
              <a href="#process" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors ${isHighContrast ? 'hover:bg-ink-900/10' : 'hover:bg-surface-50'}`}>Strategic Process</a>
              <a href="#stats" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors ${isHighContrast ? 'hover:bg-ink-900/10' : 'hover:bg-surface-50'}`}>Global Insights</a>
              <a href="#assistant" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 text-sm font-bold rounded-xl transition-colors ${isHighContrast ? 'hover:bg-ink-900/10' : 'hover:bg-surface-50'}`}>AI Advisor Instance</a>
            </nav>
            <button className={`mt-4 px-4 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isHighContrast ? 'bg-ink-900 text-white' : 'bg-ink-900 text-white'}`}>
              Establish Audit Protocol
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default React.memo(Navbar);
