"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/firebase";

const getBalanceKey = (userId: string) => `adengage-user-balance-${userId}`;

export function useCredits() {
  const { user, isUserLoading } = useUser();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (user) {
      try {
        const balanceKey = getBalanceKey(user.uid);
        const storedBalance = localStorage.getItem(balanceKey);
        if (storedBalance) {
          setCredits(parseFloat(storedBalance));
        } else {
          setCredits(0.0); // Initial balance for new users
        }
      } catch (error) {
        console.error("Could not access localStorage:", error);
        setCredits(0.0);
      }
    } else {
      // When user logs out, or no user, clear the credits
      setCredits(null);
    }
  }, [user, isUserLoading]);

  const updateCredits = useCallback((amount: number) => {
    if (user) {
      setCredits((prevCredits) => {
        const newCredits = (prevCredits ?? 0) + amount;
        try {
          const balanceKey = getBalanceKey(user.uid);
          localStorage.setItem(balanceKey, newCredits.toFixed(2));
        } catch (error) {
          console.error("Could not access localStorage:", error);
        }
        return newCredits;
      });
    }
  }, [user]);

  return { credits, updateCredits, loading: credits === null || isUserLoading };
}
