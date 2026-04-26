/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  query,
  orderBy 
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ChecklistItem } from '../types';
import { INITIAL_CHECKLIST } from '../constants';

/**
 * Institutional hook for real-time voter preparedness synchronization.
 * Fallbacks to localStorage if auth state is detached.
 */
export const useChecklist = () => {
  const [user, loading] = useAuthState(auth);
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync with Firestore when authenticated
  useEffect(() => {
    if (!user) {
      // Fallback to localStorage logic
      const saved = localStorage.getItem('voter_checklist');
      if (saved) setItems(JSON.parse(saved));
      return;
    }

    setIsSyncing(true);
    const path = `users/${user.uid}/checklist`;
    const checklistRef = collection(db, 'users', user.uid, 'checklist');
    const q = query(checklistRef, orderBy('updatedAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Bootstrap the remote checklist from initial data if empty
        INITIAL_CHECKLIST.forEach(async (item) => {
          const itemRef = doc(db, 'users', user.uid, 'checklist', String(item.id));
          try {
            await setDoc(itemRef, {
              ...item,
              updatedAt: serverTimestamp()
            });
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `${path}/${item.id}`);
          }
        });
      } else {
        const fetchedItems = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as ChecklistItem));
        // Maintain consistent protocol ordering via textual sort
        setItems(fetchedItems.sort((a, b) => a.id.localeCompare(b.id)));
      }
      setIsSyncing(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleItem = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const newChecked = !item.checked;
    const now = new Date().toISOString();

    // Optimistic Update with enhanced metadata
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: newChecked, updatedAt: now } : i));

    if (user) {
      const path = `users/${user.uid}/checklist/${id}`;
      const itemRef = doc(db, 'users', user.uid, 'checklist', id);
      try {
        await updateDoc(itemRef, {
          checked: newChecked,
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, path);
        // Rollback on failure
        setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !newChecked } : i));
      }
    } else {
      const updated = items.map(i => i.id === id ? { ...i, checked: newChecked, updatedAt: now } : i);
      localStorage.setItem('voter_checklist', JSON.stringify(updated));
    }
  };

  return { items, toggleItem, isSyncing, user, loadingAuth: loading };
};
