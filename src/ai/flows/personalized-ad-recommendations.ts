'use server';

/**
 * @fileOverview A personalized ad recommendation AI agent.
 *
 * - getPersonalizedAdRecommendations - A function that handles the personalized ad recommendations process.
 * - PersonalizedAdRecommendationsInput - The input type for the getPersonalizedAdRecommendations function.
 * - PersonalizedAdRecommendationsOutput - The return type for the getPersonalizedAdRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAdRecommendationsInputSchema = z.object({
  userProfile: z
    .string()
    .describe("O perfil do usuário, incluindo seus interesses e preferências relacionados ao futebol."),
  scoutAIStatistics: z
    .string()
    .describe('Estatísticas de futebol fornecidas pela scoutAI.'),
});
export type PersonalizedAdRecommendationsInput = z.infer<typeof PersonalizedAdRecommendationsInputSchema>;

const PersonalizedAdRecommendationsOutputSchema = z.object({
  adRecommendations: z.array(z.string()).describe('Uma lista de recomendações de anúncios personalizados.'),
});
export type PersonalizedAdRecommendationsOutput = z.infer<typeof PersonalizedAdRecommendationsOutputSchema>;

export async function getPersonalizedAdRecommendations(input: PersonalizedAdRecommendationsInput): Promise<PersonalizedAdRecommendationsOutput> {
  return personalizedAdRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedAdRecommendationsPrompt',
  input: {schema: PersonalizedAdRecommendationsInputSchema},
  output: {schema: PersonalizedAdRecommendationsOutputSchema},
  prompt: `Você é um especialista em publicidade personalizada. Com base no perfil do usuário e nas estatísticas de futebol fornecidas pela scoutAI, você fornecerá uma lista de recomendações de anúncios personalizados.

Perfil do Usuário: {{{userProfile}}}
Estatísticas da ScoutAI: {{{scoutAIStatistics}}}

Forneça uma lista de recomendações de anúncios que sejam relevantes para os interesses do usuário com base nas informações fornecidas.

{{#each adRecommendations}}
  - {{{this}}}
{{/each}}`,
});

const personalizedAdRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedAdRecommendationsFlow',
    inputSchema: PersonalizedAdRecommendationsInputSchema,
    outputSchema: PersonalizedAdRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
