
'use server';
/**
 * @fileOverview Checks the status of an M-Pesa transaction.
 *
 * - checkMpesaPaymentStatus - A function that retrieves the status of a given transaction reference.
 * - MpesaStatusInput - The input type for the checkMpesaPaymentStatus function.
 * - MpesaStatusOutput - The return type for the checkMpesaPaymentStatus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MpesaStatusInputSchema = z.object({
  reference: z.string().describe('The transaction reference returned from STK push initiation.'),
});
export type MpesaStatusInput = z.infer<typeof MpesaStatusInputSchema>;

const MpesaStatusOutputSchema = z.object({
  success: z.boolean(),
  status: z.string().optional(),
  message: z.string(),
  customerMessage: z.string().optional(),
  data: z.any().optional(),
});
export type MpesaStatusOutput = z.infer<typeof MpesaStatusOutputSchema>;

export async function checkMpesaPaymentStatus(input: MpesaStatusInput): Promise<MpesaStatusOutput> {
  return mpesaStatusFlow(input);
}

const mpesaStatusFlow = ai.defineFlow(
  {
    name: 'mpesaStatusFlow',
    inputSchema: MpesaStatusInputSchema,
    outputSchema: MpesaStatusOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.MPESA_API_KEY;
    if (!apiKey) {
      console.error("M-Pesa API key is not configured.");
      return {
        success: false,
        message: 'Server configuration error: M-Pesa API key is missing.',
        customerMessage: 'Payment service is not configured. Please contact support.',
      };
    }

    try {
      const response = await fetch(`https://lipia-api.kreativelabske.com/api/v2/payments/status?reference=${input.reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      const result = await response.json();
      return result;

    } catch (error: any) {
      console.error('M-Pesa status check API request failed:', error);
      return {
        success: false,
        message: 'Failed to connect to payment service for status check.',
        customerMessage: 'Could not check payment status.',
      };
    }
  }
);

    