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
 * Institutional Civic Intelligence Service Management.
 */

/**
 * Retrieves election-specific data (voter info) from the Google Civic API.
 * Uses a secondary caching layer to optimize sequential network requests.
 * 
 * @param address - The verified residential address for precision retrieval.
 * @returns {Promise<CivicElectionData | null>} Factual election details or null on protocol failure.
 */
export async function getVoterInfo(address: string): Promise<CivicElectionData | null> {
  // Institutional check: Cleanse and validate input to prevent API parsing failure
  const sanitizedAddress = address?.trim().toLowerCase();
  if (!sanitizedAddress || sanitizedAddress.length < 3) {
    return null;
  }

  // Primary Retrieval: Memory Cache
  if (civicCache[sanitizedAddress]) {
    console.log("[Efficiency] Cache Hit: Returning memoized voter packet.");
    return civicCache[sanitizedAddress];
  }

  // Secondary Retrieval: Session Storage Persistent Layer
  try {
    const sessionKey = `civic_voter_${btoa(sanitizedAddress)}`;
    const sessionData = sessionStorage.getItem(sessionKey);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      civicCache[sanitizedAddress] = parsed;
      return parsed;
    }
  } catch (e) { /* Non-blocking hydration failure */ }

  const apiKey = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
  if (!apiKey) {
    console.warn("Institutional Alert: VITE_GOOGLE_CIVIC_API_KEY is missing. Falling back to grounded AI only.");
    return null;
  }

  try {
    const response = await fetch(
      `${CIVIC_API_URL}/voterinfo?address=${encodeURIComponent(sanitizedAddress)}&key=${apiKey}`
    );
    
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.error?.message || response.statusText || `HTTP ${response.status}`;
      
      if (message.toLowerCase().includes('parse address')) {
        console.warn(`Civic API: Address parse failure for "${sanitizedAddress}".`);
        return null;
      }
      
      throw new Error(`Civic API failure: ${message}`);
    }

    const data = await response.json();
    const result = {
      electionName: data.election?.name || 'Upcoming Election',
      electionDay: data.election?.electionDay || 'TBD',
      pollingLocations: data.pollingLocations,
      contests: data.contests,
      state: data.state,
      normalizedInput: data.normalizedInput
    };

    // Institutional Persistence
    civicCache[sanitizedAddress] = result;
    try {
      const sessionKey = `civic_voter_${btoa(sanitizedAddress)}`;
      sessionStorage.setItem(sessionKey, JSON.stringify(result));
    } catch (e) { /* Storage limit reached or unavailable */ }

    return result;
  } catch (error) {
    console.error("Civic API Integration Error:", error);
    return null;
  }
}

/**
 * Fetches institutional representative data for the provided address with efficient caching.
 * @param address - Validated jurisdiction address.
 */
export async function getRepresentatives(address: string) {
  const sanitizedAddress = address?.trim().toLowerCase();
  if (!sanitizedAddress || sanitizedAddress.length < 3) return null;

  // Efficiency layer: Check memory and session cache
  if (civicCache[`reps_${sanitizedAddress}`]) return civicCache[`reps_${sanitizedAddress}`];

  try {
    const sessionKey = `civic_reps_${btoa(sanitizedAddress)}`;
    const sessionData = sessionStorage.getItem(sessionKey);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      civicCache[`reps_${sanitizedAddress}`] = parsed;
      return parsed;
    }
  } catch (e) {}

  const apiKey = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `${CIVIC_API_URL}/representatives?address=${encodeURIComponent(sanitizedAddress)}&key=${apiKey}`
    );
    
    if (!response.ok) return null;
    const data = await response.json();
    
    // Cache the result for future sessions
    civicCache[`reps_${sanitizedAddress}`] = data;
    try {
      const sessionKey = `civic_reps_${btoa(sanitizedAddress)}`;
      sessionStorage.setItem(sessionKey, JSON.stringify(data));
    } catch (e) {}

    return data;
  } catch (e) {
    return null;
  }
}
