"use server";

import { getPersonalizedAdRecommendations } from "@/ai/flows/personalized-ad-recommendations";
import type { PersonalizedAdRecommendationsInput } from "@/ai/flows/personalized-ad-recommendations";

export async function generateAds(
  input: PersonalizedAdRecommendationsInput
): Promise<{ adRecommendations: string[] } | { error: string }> {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    return { error: "AI features are not configured. Please set a Google AI API key in your environment variables to enable personalized recommendations." };
  }
  
  try {
    // In a real application, you might fetch more detailed scoutAI stats here.
    const fullInput = {
      ...input,
      scoutAIStatistics: input.scoutAIStatistics || "General football stats: High user engagement with Premier League content.",
    };

    const result = await getPersonalizedAdRecommendations(fullInput);
    if (!result || !result.adRecommendations) {
      return { error: "Failed to generate ad recommendations." };
    }
    return result;
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "An unexpected error occurred.";
    return { error: message };
  }
}
