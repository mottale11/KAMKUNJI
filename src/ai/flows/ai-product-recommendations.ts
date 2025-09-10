// src/ai/flows/ai-product-recommendations.ts
'use server';

/**
 * @fileOverview AI-driven product recommendations based on viewing history and past purchases.
 *
 * - getProductRecommendations - A function that retrieves AI-driven product recommendations for a user.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  viewingHistory: z.array(z.string()).describe('The IDs of the products the user has viewed.'),
  pastPurchases: z.array(z.string()).describe('The IDs of the products the user has purchased.'),
  numRecommendations: z.number().default(5).describe('The number of product recommendations to return.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  productIds: z.array(z.string()).describe('The IDs of the recommended products.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an expert e-commerce product recommendation system.

  Based on the user's viewing history and past purchases, you will recommend products that the user might be interested in.

  User ID: {{{userId}}}
  Viewing History: {{#if viewingHistory}}{{#each viewingHistory}}- {{{this}}}{{/each}}{{else}}No viewing history{{/if}}
  Past Purchases: {{#if pastPurchases}}{{#each pastPurchases}}- {{{this}}}{{/each}}{{else}}No past purchases{{/if}}

  Number of Recommendations: {{{numRecommendations}}}

  Return a JSON array of product IDs.
  Make sure you only return product IDs, and nothing else.`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
