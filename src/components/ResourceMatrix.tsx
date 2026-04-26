/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BookOpen, 
  Files, 
  UserCheck, 
  MapPin, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';

interface ResourceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  category: string;
  link: string;
  delay: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ icon: Icon, title, description, category, link, delay }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="group relative block p-6 bg-white border border-surface-200 rounded-[2rem] hover:border-brand-blue hover:shadow-2xl transition-all h-full overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className="w-16 h-16 text-brand-blue" />
    </div>
    
    <div className="relative z-10">
      <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest px-3 py-1 bg-brand-blue/5 rounded-full mb-4 inline-block">
        {category}
      </span>
      <h3 className="text-lg font-display font-bold text-ink-900 mb-2 flex items-center gap-2">
        {title} <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </h3>
      <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
        {description}
      </p>
      
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink-900 uppercase tracking-widest">
        <span>Access Portal</span>
        <div className="w-1 h-1 bg-brand-blue rounded-full" />
        <span className="text-brand-blue">Verify Connection</span>
      </div>
    </div>
  </motion.a>
);

/**
 * Institutional Resource Matrix: A bento-grid for strategic election data.
 */
const ResourceMatrix: React.FC = () => {
  const resources = [
    {
      icon: Files,
      title: "Voter ID Protocals",
      description: "Verify state-specific identification requirements for both mail-in and in-person voting instances.",
      category: "Legal Framework",
      link: "https://www.vote411.org/voter-id"
    },
    {
      icon: UserCheck,
      title: "Sample Ballot Audit",
      description: "Generate a localized preview of candidates and referendums specific to your precinct geolocation.",
      category: "Strategic Prep",
      link: "https://ballotpedia.org/Sample_Ballot_Lookup"
    },
    {
      icon: ShieldCheck,
      title: "Poll Watcher Registry",
      description: "Official procedures for becoming a non-partisan election observer to ensure institutional integrity.",
      category: "Governance",
      link: "https://www.eac.gov/election-officials/poll-watchers"
    },
    {
      icon: Zap,
      title: "Rapid Action Center",
      description: "Real-time updates on polling location changes or emergency extensions in your jurisdiction.",
      category: "Alert System",
      link: "https://www.nass.org/can-I-vote"
    }
  ];

  return (
    <section id="matrix" className="py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight mb-2">Institutional Resource Matrix</h2>
          <p className="text-sm text-slate-500 font-medium max-w-xl">
            A high-density repository of verified strategic assets. Synchronized with the US Election Assistance Commission.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-ink-700/40 uppercase tracking-widest leading-none mb-1">Last Update: May 2026</span>
            <span className="text-xs font-bold text-green-600 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Verified Protocol
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((res, idx) => (
          <ResourceCard key={res.title} {...res} delay={idx * 0.1} />
        ))}
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 bg-ink-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="shrink-0 w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10">
            <Globe className="w-10 h-10 text-brand-blue" />
          </div>
          <div>
            <h4 className="text-xl font-bold mb-2">International Observation Model</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
              Access comparative analysis of democratic resilience across 45+ jurisdictions. Optimized for policy research and institutional benchmarking.
            </p>
            <button className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:translate-y-[-2px] transition-all">
              Launch Global Report
            </button>
          </div>
        </div>
        
        <div className="p-8 bg-slate-900 rounded-[2rem] text-white flex flex-col justify-center border border-white/5 shadow-2xl">
          <BookOpen className="w-10 h-10 text-slate-400 mb-6" />
          <h4 className="text-lg font-bold mb-3">Civil Rights Lexicon</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
            Comprehensive glossary of legislative terms and constitutional definitions related to suffrage.
          </p>
          <div className="mt-auto flex items-center justify-between">
             <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">v1.4 Internal Release</span>
             <button className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
               <ExternalLink className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceMatrix;
