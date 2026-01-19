"use server";

import { getPersonalizedAdRecommendations } from "@/ai/flows/personalized-ad-recommendations";
import type { PersonalizedAdRecommendationsInput } from "@/ai/flows/personalized-ad-recommendations";

export async function generateAds(
  input: PersonalizedAdRecommendationsInput
): Promise<{ adRecommendations: string[] } | { error: string }> {
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
    return { error: "An unexpected error occurred." };
  }
}
