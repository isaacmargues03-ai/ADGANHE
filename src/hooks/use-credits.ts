"use client";

import { useCallback } from "react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, increment, runTransaction, serverTimestamp } from "firebase/firestore";

export function useCredits() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, "users", user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading: isUserDocLoading } = useDoc<{credits: number}>(userDocRef);

  const updateCredits = useCallback(async (amount: number) => {
    if (!userDocRef || !firestore || !user) {
      throw new Error("Referência do usuário ou Firestore não disponível.");
    }

    // Use a transaction for a safe read-modify-write operation.
    // This will create the document if it doesn't exist, or update it if it does.
    await runTransaction(firestore, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);

      if (!userDoc.exists()) {
        // Document doesn't exist: This is a user that exists in Auth but not in Firestore.
        // Create the document with an initial credit balance.
        transaction.set(userDocRef, {
          id: user.uid,
          email: user.email,
          credits: amount,
          score: amount,
          saldo: amount,
          registrationDate: serverTimestamp(),
          lastLogin: serverTimestamp(),
          username: user.email?.split('@')[0] ?? `user_${user.uid.substring(0,5)}`,
        });
      } else {
        // Document exists: Atomically increment the credit fields.
        transaction.update(userDocRef, {
          credits: increment(amount),
          score: increment(amount),
          saldo: increment(amount),
        });
      }
    });
  }, [user, firestore, userDocRef]);

  const isLoading = isUserLoading || isUserDocLoading;

  return { credits: userData?.credits, updateCredits, loading: isLoading };
}
