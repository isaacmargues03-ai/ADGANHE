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
    .describe("The user's profile, including their interests and preferences related to football."),
  scoutAIStatistics: z
    .string()
    .describe('Football statistics provided by scoutAI.'),
});
export type PersonalizedAdRecommendationsInput = z.infer<typeof PersonalizedAdRecommendationsInputSchema>;

const PersonalizedAdRecommendationsOutputSchema = z.object({
  adRecommendations: z.array(z.string()).describe('A list of personalized ad recommendations.'),
});
export type PersonalizedAdRecommendationsOutput = z.infer<typeof PersonalizedAdRecommendationsOutputSchema>;

export async function getPersonalizedAdRecommendations(input: PersonalizedAdRecommendationsInput): Promise<PersonalizedAdRecommendationsOutput> {
  return personalizedAdRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedAdRecommendationsPrompt',
  input: {schema: PersonalizedAdRecommendationsInputSchema},
  output: {schema: PersonalizedAdRecommendationsOutputSchema},
  prompt: `You are an expert in personalized advertising. Based on the user's profile and football statistics provided by scoutAI, you will provide a list of personalized ad recommendations.

User Profile: {{{userProfile}}}
ScoutAI Statistics: {{{scoutAIStatistics}}}

Provide a list of ad recommendations that are relevant to the user's interests based on the provided information.

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
