/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface TimelineStep {
  id: number;
  title: string;
  date: string;
  description: string;
  icon: React.ReactNode;
  status: 'Completed' | 'Active' | 'Upcoming';
}

export interface VoterTrend {
  year: string;
  turnout: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  citations?: Array<{
    title: string;
    html: string;
  }>;
}

export interface LocationData {
  city: string;
  state: string;
}

export interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}
