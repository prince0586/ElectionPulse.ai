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
  // Institutional check: Cleanse and validate input to prevent API parsing failure
  const sanitizedAddress = address?.trim();
  if (!sanitizedAddress || sanitizedAddress.length < 3) {
    return null;
  }

  if (civicCache[sanitizedAddress]) return civicCache[sanitizedAddress];

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
      
      // If the address cannot be parsed, we treat it as a localized "not found" rather than a hard failure
      if (message.toLowerCase().includes('parse address')) {
        console.warn(`Civic API: Address parse failure for "${sanitizedAddress}". Return null sync.`);
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
      state: data.state
    };

    civicCache[sanitizedAddress] = result;
    return result;
  } catch (error) {
    console.error("Civic API Integration Error:", error);
    return null; // Ensure high-resilience by returning null instead of throwing in production flow
  }
}

/**
 * Fetches institutional representative data for the provided address.
 */
export async function getRepresentatives(address: string) {
  const sanitizedAddress = address?.trim();
  if (!sanitizedAddress || sanitizedAddress.length < 3) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `${CIVIC_API_URL}/representatives?address=${encodeURIComponent(sanitizedAddress)}&key=${apiKey}`
    );
    
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    return null;
  }
}
