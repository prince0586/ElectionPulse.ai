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

export interface GroundingSource {
  title: string;
  url: string;
  snippet?: string;
  html?: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  citations?: GroundingSource[];
  confidenceScore?: number;
  isStreaming?: boolean;
}

export interface UserPreferences {
  zipCode: string;
  isHighContrast: boolean;
  onboardingComplete: boolean;
  lastLogin: string;
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
  id: string;
  address: {
    locationName?: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  pollingHours?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface CivicContest {
  type: string;
  office?: string;
  ballotTitle?: string;
  district?: {
    name: string;
    scope: string;
  };
  candidates?: Array<{
    name: string;
    party: string;
    candidateUrl?: string;
    channels?: Array<{ type: string; id: string }>;
  }>;
}

export interface CivicOfficial {
  name: string;
  address?: Array<{
    line1: string;
    city: string;
    state: string;
    zip: string;
  }>;
  party?: string;
  phones?: string[];
  urls?: string[];
  photoUrl?: string;
  channels?: Array<{ type: string; id: string }>;
}

export interface CivicOffice {
  name: string;
  divisionId: string;
  levels?: string[];
  roles?: string[];
  officialIndices: number[];
}

export interface CivicRepresentativeResponse {
  offices: CivicOffice[];
  officials: CivicOfficial[];
  divisions: Record<string, { name: string }>;
  normalizedInput?: {
    line1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  priority: 'low' | 'medium' | 'high';
  updatedAt: string;
}
