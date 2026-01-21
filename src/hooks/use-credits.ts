"use client";

import { useCallback } from "react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export function useCredits() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, "users", user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc<{credits: number}>(userDocRef);

  const updateCredits = useCallback((amount: number) => {
      if (!userDocRef) return;
      // Use increment for atomic updates, which is safer for currency.
      updateDoc(userDocRef, {
          credits: increment(amount),
          score: increment(amount)
      });
  }, [userDocRef]);

  const isLoading = isUserLoading || isUserDocLoading;

  return { credits: userData?.credits, updateCredits, loading: isLoading };
}
