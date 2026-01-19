"use client";

import { useState, useEffect, useCallback } from "react";

const BALANCE_KEY = "adengage-user-balance";

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedBalance = localStorage.getItem(BALANCE_KEY);
      if (storedBalance) {
        setCredits(parseFloat(storedBalance));
      } else {
        setCredits(0.0); // Initial balance for new users
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      setCredits(0.0);
    }
  }, []);

  const updateCredits = useCallback((amount: number) => {
    setCredits((prevCredits) => {
      const newCredits = (prevCredits ?? 0) + amount;
      try {
        localStorage.setItem(BALANCE_KEY, newCredits.toFixed(2));
      } catch (error) {
        console.error("Could not access localStorage:", error);
      }
      return newCredits;
    });
  }, []);

  return { credits, updateCredits, loading: credits === null };
}
