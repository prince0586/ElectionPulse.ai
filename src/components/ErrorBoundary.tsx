/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, RefreshCw, Trash2, Home, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Institutional Reliability Layer: Catches procedural exceptions and provides resolution pathways.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[CRITICAL SYSTEM FAULT]:", error, errorInfo);
  }

  handleHardRefresh = () => {
    window.location.reload();
  };

  handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pro-card max-w-lg w-full bg-white border border-red-200 shadow-2xl relative overflow-hidden"
          >
            {/* Warning Header */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500" />
            
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900 tracking-tight">Institutional Alert</h2>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none mt-1">System Integrity Disrupted</p>
                </div>
              </div>

              <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-red-900 uppercase mb-1">Diagnostic Report</h3>
                    <p className="text-xs text-red-700/80 leading-relaxed font-medium">
                      {this.state.error?.message || "Procedural anomaly detected in the runtime environment."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-ink-700/60 leading-relaxed mb-6 font-medium">
                  The protocol sync has been suspended to prevent data corruption. Select a resolution pathway to restore operational status.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={this.handleHardRefresh}
                    className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-2xl hover:border-brand-blue hover:bg-brand-blue/5 transition-all group text-left"
                  >
                    <RefreshCw className="w-5 h-5 text-slate-400 group-hover:text-brand-blue mb-3 transition-colors" />
                    <span className="text-xs font-bold text-ink-900 mb-1">Hard Refresh</span>
                    <span className="text-[10px] text-slate-400 font-medium">Re-sync application state from server.</span>
                  </button>

                  <button 
                    onClick={this.handleClearCache}
                    className="flex flex-col items-start p-4 bg-white border border-slate-200 rounded-2xl hover:border-red-400 hover:bg-red-50 transition-all group text-left"
                  >
                    <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-500 mb-3 transition-colors" />
                    <span className="text-xs font-bold text-ink-900 mb-1">Clear Local Cache</span>
                    <span className="text-[10px] text-slate-400 font-medium">Wipe stored preferences & re-init login.</span>
                  </button>
                </div>

                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full mt-6 py-3 bg-ink-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 hover:bg-ink-800 transition-all shadow-lg active:scale-95"
                >
                  <Home className="w-4 h-4" /> Return to Terminal Home
                </button>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 italic text-[10px] text-slate-400 text-center font-medium">
              Reference Code: {Math.random().toString(36).substring(7).toUpperCase()}-SYSTEM-FAILURE
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
