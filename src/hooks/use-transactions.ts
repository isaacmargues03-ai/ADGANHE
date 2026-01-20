"use client";

import { useCallback } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, Timestamp } from "firebase/firestore";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  createdAt: Timestamp;
};

export function useTransactions() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const transactionsQuery = useMemoFirebase(() => {
      if (!user || !firestore) return null;
      return query(
          collection(firestore, "users", user.uid, "transactions"),
          orderBy("createdAt", "desc")
      );
  }, [user, firestore]);

  const { data: transactions, isLoading: isTransactionsLoading } = useCollection<Omit<Transaction, 'id'>>(transactionsQuery);

  const addTransaction = useCallback((transactionDetails: { description: string, amount: number }) => {
    if (user && firestore) {
      const transactionsColRef = collection(firestore, "users", user.uid, "transactions");
      addDoc(transactionsColRef, {
        ...transactionDetails,
        createdAt: serverTimestamp()
      });
    }
  }, [user, firestore]);
  
  const loading = isUserLoading || isTransactionsLoading;

  return { transactions: transactions ?? [], addTransaction, loading };
}
