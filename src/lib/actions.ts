"use server";

import { getPersonalizedAdRecommendations } from "@/ai/flows/personalized-ad-recommendations";
import type { PersonalizedAdRecommendationsInput } from "@/ai/flows/personalized-ad-recommendations";

export async function generateAds(
  input: PersonalizedAdRecommendationsInput
): Promise<{ adRecommendations: string[] } | { error: string }> {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    return { error: "Os recursos de IA não estão configurados. Defina uma chave de API do Google AI em suas variáveis de ambiente para ativar recomendações personalizadas." };
  }
  
  try {
    // In a real application, you might fetch more detailed scoutAI stats here.
    const fullInput = {
      ...input,
      scoutAIStatistics: input.scoutAIStatistics || "Estatísticas gerais de futebol: Alto engajamento do usuário com conteúdo da Premier League.",
    };

    const result = await getPersonalizedAdRecommendations(fullInput);
    if (!result || !result.adRecommendations) {
      return { error: "Falha ao gerar recomendações de anúncios." };
    }
    return result;
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Ocorreu um erro inesperado.";
    return { error: message };
  }
}
