/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserPlus, History, Award, Info, Clock, Vote } from 'lucide-react';
import { TimelineStep, VoterTrend, FAQItem, ChecklistItem } from './types';

export const TIMELINE_DATA: TimelineStep[] = [
  { id: 1, title: "Voter Registration", date: "Month -6", description: "Ensure you are registered to vote in your specific district. Deadlines vary by state.", icon: React.createElement(UserPlus, { className: "w-5 h-5" }), status: "Completed" },
  { id: 2, title: "Primary Elections", date: "Month -4", description: "Parties select their candidates for the general election.", icon: React.createElement(History, { className: "w-5 h-5" }), status: "Completed" },
  { id: 3, title: "National Conventions", date: "Month -3", description: "Official nomination of presidential and vice-presidential candidates.", icon: React.createElement(Award, { className: "w-5 h-5" }), status: "Active" },
  { id: 4, title: "Voter Education", date: "Month -2", description: "Research candidates, ballot measures, and local issues.", icon: React.createElement(Info, { className: "w-5 h-5" }), status: "Upcoming" },
  { id: 5, title: "Early & Mail-in Voting", date: "Month -1", description: "Convenient options to cast your ballot before election day.", icon: React.createElement(Clock, { className: "w-5 h-5" }), status: "Upcoming" },
  { id: 6, title: "General Election", date: "Nov 5", description: "The final decision day. Polls are open nationwide.", icon: React.createElement(Vote, { className: "w-5 h-5" }), status: "Upcoming" },
];

export const VOTER_TRENDS: VoterTrend[] = [
  { year: '1992', turnout: 58.1 },
  { year: '1996', turnout: 51.7 },
  { year: '2000', turnout: 54.2 },
  { year: '2004', turnout: 60.1 },
  { year: '2008', turnout: 61.6 },
  { year: '2012', turnout: 58.6 },
  { year: '2016', turnout: 60.1 },
  { year: '2020', turnout: 66.7 },
];

export const FAQS: FAQItem[] = [
  { question: "How do I register to vote?", answer: "Most states allow registration online, by mail, or in person at local election offices. Requirements vary, but usually include being a citizen and at least 18 years old." },
  { question: "What is the deadline for mail-in ballots?", answer: "Deadlines differ significantly by state. Some require ballots to be received by election day, while others accept them if postmarked by then." },
  { question: "Where is my polling place?", answer: "Your polling place is determined by your residential address. You can find it on your state's official election website or Secretary of State portal." },
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 1, text: "Verify Registration Status", checked: false },
  { id: 2, text: "Locate Certified Polling Station", checked: false },
  { id: 3, text: "Review Sample Ballot Data", checked: false },
  { id: 4, text: "Check Valid Identification Laws", checked: false },
  { id: 5, text: "Finalize Election Day Schedule", checked: false },
];

export const STATE_WAIT_FACTORS: Record<string, number> = {
  'California': 0.8,
  'Texas': 1.2,
  'New York': 1.1,
  'Florida': 1.3,
  'Georgia': 1.4,
  'Arizona': 1.2,
  'Pennsylvania': 1.1,
  'Default': 1.0
};

export const AI_CONFIG = {
  model: 'gemini-3-flash-preview',
  systemInstruction: "You are a professional, non-partisan election advisor. You help users understand voting processes, historical context, and technical steps. ALWAYS cite sources when provided by the grounding tool. If you provide a date or deadline, verify it using the search tool.",
};
