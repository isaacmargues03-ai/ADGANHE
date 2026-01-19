"use client";

import { useState, useEffect, useCallback } from "react";

const CREDITS_KEY = "adengage-user-credits";

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedCredits = localStorage.getItem(CREDITS_KEY);
      if (storedCredits) {
        setCredits(parseInt(storedCredits, 10));
      } else {
        setCredits(500); // Initial credits for new users
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      setCredits(500);
    }
  }, []);

  const updateCredits = useCallback((amount: number) => {
    setCredits((prevCredits) => {
      const newCredits = (prevCredits ?? 0) + amount;
      try {
        localStorage.setItem(CREDITS_KEY, newCredits.toString());
      } catch (error) {
        console.error("Could not access localStorage:", error);
      }
      return newCredits;
    });
  }, []);

  return { credits, updateCredits, loading: credits === null };
}
