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
  confidenceScore?: number;
}

export interface LocationData {
  city: string;
  state: string;
  zipCode?: string;
}

export interface GoogleCalendarEvent {
  text: string;
  dates: string;
  details: string;
  location: string;
}

export interface CivicPollingLocation {
  address: {
    locationName?: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  pollingHours?: string;
  notes?: string;
}

export interface CivicContest {
  type: string;
  office?: string;
  district?: {
    name: string;
    scope: string;
  };
  candidates?: Array<{
    name: string;
    party: string;
  }>;
}

export interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}
