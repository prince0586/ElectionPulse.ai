/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Save, 
  Key, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { updateProfile, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';

interface UserProfileProps {
  onBack: () => void;
  isHighContrast: boolean;
}

/**
 * Institutional component for managing user credentials and institutional identity.
 */
const UserProfile: React.FC<UserProfileProps> = ({ onBack, isHighContrast }) => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    setMessage(null);
    try {
      await updateProfile(user, { displayName });
      setMessage({ type: 'success', text: 'Personnel identity updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Identity update disruption. Please re-authenticate.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!user) return;
    try {
      await sendEmailVerification(user);
      setMessage({ type: 'success', text: 'Verification protocol dispatched to your terminal.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Protocol dispatch failure. Frequency limit exceeded?' });
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage({ type: 'success', text: 'Credential recovery sequence initiated via email.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Recovery initiation failure. Institutional block detected.' });
    }
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto w-full px-4"
    >
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className={`p-3 rounded-xl border transition-all ${isHighContrast ? 'border-ink-900 hover:bg-ink-900/10' : 'border-surface-200 hover:bg-surface-50'}`}
        >
          <ArrowLeft className="w-5 h-5 text-ink-700" />
        </button>
        <div>
          <h2 className="text-2xl font-display font-bold text-ink-900 tracking-tight">Personnel Profile</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Institutional Identity Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-12">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <span className="text-xs font-bold uppercase tracking-wider">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="pro-card bg-white border border-surface-200 p-8">
            <h3 className="text-[11px] font-bold text-ink-700 uppercase tracking-[0.2em] mb-8 px-2 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-brand-blue" />
              Identity Credentials
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Assigned Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all font-medium text-sm text-ink-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Terminal Email</label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={user.email || ''} 
                      readOnly 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl font-medium text-sm text-ink-900 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-8 py-3.5 bg-brand-blue text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-blue/90 disabled:opacity-50 transition-all shadow-lg active:scale-95"
                >
                  {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Synchronize Identity
                </button>
              </div>
            </form>
          </div>

          <div className="pro-card bg-white border border-surface-200 p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Key className="w-24 h-24" />
             </div>
             <h3 className="text-[11px] font-bold text-ink-700 uppercase tracking-[0.2em] mb-8 px-2 flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-brand-blue" />
              Security Protocol
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
              <div className="max-w-md">
                <h4 className="text-sm font-bold text-ink-900 mb-1">Credential Sequence Reset</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Initiate a secure password recovery sequence. A dynamic link will be dispatched to your registered email terminus.</p>
              </div>
              <button 
                onClick={handleResetPassword}
                className="whitespace-nowrap px-6 py-3 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all bg-white shadow-sm"
              >
                Initiate Reset
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className={`pro-card p-8 border-2 transition-all ${user.emailVerified ? 'border-green-500/20 bg-green-50/10' : 'border-brand-crimson/20 bg-red-50/10'}`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${user.emailVerified ? 'bg-green-100 text-green-600' : 'bg-red-100 text-brand-crimson'}`}>
                {user.emailVerified ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
              </div>
              <h3 className="text-lg font-display font-bold text-ink-900 mb-2 truncate w-full">
                {user.emailVerified ? 'Protocol Verified' : 'Action Required'}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
                {user.emailVerified 
                  ? 'Your institutional terminal is fully authenticated and synchronized with federal records.'
                  : 'Email verification is required to establish full strategic data connectivity.'}
              </p>
              
              {!user.emailVerified && (
                <button 
                  onClick={handleVerifyEmail}
                  className="w-full py-3 bg-ink-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-ink-800 transition-all shadow-md active:scale-95"
                >
                  Verify Terminal
                </button>
              )}
            </div>
          </div>

          <div className="pro-card p-6 bg-surface-50 border border-surface-200">
            <h4 className="text-[10px] font-bold text-ink-700/40 uppercase tracking-widest mb-4">Metadata Analysis</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Terminal ID</span>
                <span className="text-[10px] font-mono text-ink-900 opacity-60">{user.uid.substring(0, 8)}...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Instance Created</span>
                <span className="text-[10px] font-bold text-ink-900">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Last Synchronization</span>
                <span className="text-[10px] font-bold text-ink-900">{user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
