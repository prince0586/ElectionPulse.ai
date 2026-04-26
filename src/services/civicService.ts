/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CIVIC_API_URL } from '../constants';

export interface CivicElectionData {
  electionName: string;
  electionDay: string;
  pollingLocations?: any[];
  contests?: any[];
  state?: any[];
}

const civicCache: Record<string, any> = {};

/**
 * Service to interact with Google Civic Information API for official election data.
 * Optimized with client-side memoization for institutional efficiency.
 */
export async function getVoterInfo(address: string): Promise<CivicElectionData | null> {
  if (civicCache[address]) return civicCache[address];

  const apiKey = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
  if (!apiKey) {
    console.warn("Institutional Alert: VITE_GOOGLE_CIVIC_API_KEY is missing. Falling back to grounded AI only.");
    return null;
  }

  try {
    const response = await fetch(
      `${CIVIC_API_URL}/voterinfo?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.error?.message || response.statusText || `HTTP ${response.status}`;
      throw new Error(`Civic API failure: ${message}`);
    }

    const data = await response.json();
    const result = {
      electionName: data.election?.name || 'Upcoming Election',
      electionDay: data.election?.electionDay || 'TBD',
      pollingLocations: data.pollingLocations,
      contests: data.contests,
      state: data.state
    };

    civicCache[address] = result;
    return result;
  } catch (error) {
    console.error("Civic API Integration Error:", error);
    throw error;
  }
}

/**
 * Fetches institutional representative data for the provided address.
 */
export async function getRepresentatives(address: string) {
  const apiKey = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `${CIVIC_API_URL}/representatives?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
}
