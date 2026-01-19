"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/firebase";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
};

const getTransactionsKey = (userId: string) => `adganhe-transactions-${userId}`;

export function useTransactions() {
  const { user, isUserLoading } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
        setLoading(true);
        return;
    }

    if (user) {
      try {
        const transactionsKey = getTransactionsKey(user.uid);
        const storedTransactions = localStorage.getItem(transactionsKey);
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Could not access localStorage for transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    } else {
        setTransactions([]);
        setLoading(false);
    }
  }, [user, isUserLoading]);

  const addTransaction = useCallback((transactionDetails: { description: string, amount: number }) => {
    if (user) {
      setTransactions((prevTransactions) => {
        const newTransaction: Transaction = {
          ...transactionDetails,
          id: `txn-${Date.now()}`,
          date: new Intl.DateTimeFormat('pt-BR').format(new Date()),
        };
        const newTransactions = [newTransaction, ...prevTransactions];
        try {
          const transactionsKey = getTransactionsKey(user.uid);
          localStorage.setItem(transactionsKey, JSON.stringify(newTransactions));
        } catch (error) {
          console.error("Could not save transactions to localStorage:", error);
        }
        return newTransactions;
      });
    }
  }, [user]);

  return { transactions, addTransaction, loading };
}
