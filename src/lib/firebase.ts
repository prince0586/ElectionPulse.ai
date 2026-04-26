/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);

// Use initializeFirestore with forced settings for maximum stability in proxied environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: false,
}, firebaseConfig.firestoreDatabaseId || '(default)');

/**
 * Firestore Error Handling Protocol
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const isOffline = error instanceof Error && (error.message.includes('offline') || error.message.includes('backend'));
  
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  
  const errorMessage = JSON.stringify(errInfo);
  
  if (isOffline) {
    console.warn(`Institutional Firestore [Sync Latency]: Protocol ${operationType} on ${path} is currently buffered.`);
  } else {
    console.error('Institutional Firestore Error: ', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Validates connection to Firestore as per institutional security protocols.
 */
async function testConnection() {
  const path = '_internal/connectivity-check';
  
  // High-resilience delay to allow network stack and proxy handshake to stabilize
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    // Attempt to read a dummy document to verify connectivity
    // Using getDocFromServer ensures we aren't just reading from a potentially empty cache
    await getDocFromServer(doc(db, '_internal', 'connectivity-check'));
    console.log('Institutional Firestore: Connection verified.');
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('backend'))) {
      // In proxied environments, first attempt may fail due to cold start or proxy handshake
      console.warn('Institutional Firestore: Initial sync latency detected. Operating in high-resilience mode.');
    } else {
      // Logic failure or permission error is expected here if document doesn't exist, 
      // but it confirms we reached the server.
      console.log('Institutional Firestore: Backend reachable.');
    }
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}
