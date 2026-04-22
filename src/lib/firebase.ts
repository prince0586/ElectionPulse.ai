/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Validates connection to Firestore as per institutional security protocols.
 */
async function testConnection() {
  try {
    // Attempt to read a dummy document to verify connectivity
    await getDocFromServer(doc(db, '_internal', 'connectivity-check'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Institutional Sync Error: Firestore client is offline. Verify network protocols.");
    }
    // Expected to fail if doc doesn't exist, but verifies network path
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}
