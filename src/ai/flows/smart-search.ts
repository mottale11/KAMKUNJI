'use server';

/**
 * @fileOverview Smart search functionality using AI for fuzzy search, auto-suggestions, and search result ranking.
 *
 * - smartSearch - A function that handles the smart search process.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSearchInputSchema = z.object({
  query: z.string().describe('The user search query.'),
  category: z.string().optional().describe('The category to filter the search results.'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      productId: z.string().describe('The ID of the product.'),
      title: z.string().describe('The title of the product.'),
      description: z.string().describe('A short description of the product.'),
      imageUrl: z.string().optional().describe('URL of the product image.'),
      price: z.number().describe('The price of the product.'),
    })
  ).describe('The search results, ranked by relevance.'),
  suggestions: z.array(z.string()).describe('Auto-suggestions for the search query.'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

const smartSearchPrompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  prompt: `You are an AI-powered search assistant for an e-commerce marketplace.

  Your goal is to provide relevant search results and helpful suggestions to the user.

  Based on the user's query and the optional category filter, generate a list of relevant products and search suggestions.

  Query: {{{query}}}
  Category: {{#if category}}{{{category}}}{{else}}All Categories{{/if}}

  Return the results in the following JSON format:
  {{json SmartSearchOutputSchema}}
  `,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const {output} = await smartSearchPrompt(input);
    return output!;
  }
);
