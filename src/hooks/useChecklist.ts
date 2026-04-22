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
import { auth, db } from '../lib/firebase';
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
    const checklistRef = collection(db, 'users', user.uid, 'checklist');
    const q = query(checklistRef, orderBy('updatedAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Bootstrap the remote checklist from initial data if empty
        INITIAL_CHECKLIST.forEach(async (item) => {
          const itemRef = doc(db, 'users', user.uid, 'checklist', String(item.id));
          await setDoc(itemRef, {
            ...item,
            updatedAt: serverTimestamp()
          });
        });
      } else {
        const fetchedItems = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: Number(doc.id)
        } as ChecklistItem));
        // Sort by ID to maintain protocol order
        setItems(fetchedItems.sort((a, b) => a.id - b.id));
      }
      setIsSyncing(false);
    }, (error) => {
      console.error("Firestore Checklist Sync Error:", error);
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleItem = async (id: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const newChecked = !item.checked;

    // Optimistic Update
    setItems(items.map(i => i.id === id ? { ...i, checked: newChecked } : i));

    if (user) {
      const itemRef = doc(db, 'users', user.uid, 'checklist', String(id));
      await updateDoc(itemRef, {
        checked: newChecked,
        updatedAt: serverTimestamp()
      });
    } else {
      // Save to localStorage for non-auth users
      const updated = items.map(i => i.id === id ? { ...i, checked: newChecked } : i);
      localStorage.setItem('voter_checklist', JSON.stringify(updated));
    }
  };

  return { items, toggleItem, isSyncing, user, loadingAuth: loading };
};
