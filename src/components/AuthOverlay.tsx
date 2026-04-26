/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User as UserIcon, LogOut, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AuthOverlayProps {
  onClose: () => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        await sendEmailVerification(auth.currentUser);
        setVerificationSent(true);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (currentUser && !currentUser.emailVerified && !verificationSent) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-ink-900 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl relative"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-slate-400 text-sm mb-8">
              Protocol requirement: Confirm identity at <span className="text-white font-bold">{currentUser.email}</span> to enable secure synchronization.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resend Verification Protocol'}
              </button>
              
              <button 
                onClick={() => signOut(auth)}
                className="w-full py-4 border border-white/10 text-white/60 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
              >
                Sign Out
              </button>
            </div>
            
            <p className="mt-8 text-[10px] text-white/30 uppercase tracking-[0.2em] cursor-pointer hover:text-white" onClick={onClose}>
              Continue with Limited Access
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (verificationSent) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-ink-900 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Protocol Initiated</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              We've dispatched a synchronization link to your terminal. Please verify your email to establish a secure personnel connection.
            </p>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold uppercase tracking-widest text-xs"
            >
              Acknowledge
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-black">
          <LogOut className="w-5 h-5 rotate-180" />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center font-display font-bold text-xl mb-6 shadow-lg shadow-brand-blue/20">E</div>
          <h2 className="text-2xl font-display font-bold text-ink-900 tracking-tight">
            {isLogin ? 'Access Portal' : 'Establish Protocol'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isLogin ? 'Sync your voter readiness data.' : 'Join the institutional election pulse.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="personnel@electionpulse.ai"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Secure Passkey</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="text-[11px] font-medium text-red-600 leading-tight">{error}</span>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-brand-blue/20 hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Establish Sync' : 'Initiate Protocol')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            {isLogin ? "Don't have a protocol instance?" : "Already have an instance?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-brand-blue font-bold hover:underline"
            >
              {isLogin ? 'Register New' : 'Access Portal'}
            </button>
          </p>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Alternate Sync</span>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-semibold text-sm text-ink-900 shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/hf/google.svg" alt="Google" className="w-4 h-4" />
            Personnel Identity Sync
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthOverlay;
