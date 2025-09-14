
'use server';

/**
 * @fileOverview Handles M-Pesa STK push payment requests.
 *
 * - initiateMpesaPayment - A function that initiates an M-Pesa STK push.
 * - MpesaPaymentInput - The input type for the initiateMpesaPayment function.
 * - MpesaPaymentOutput - The return type for the initiateMpesaPayment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MpesaPaymentInputSchema = z.object({
  phone_number: z.string().describe('Customer\'s phone number in (e.g., 0712345678 , 0112345678, 254712345678)'),
  amount: z.number().describe('The amount to be paid.'),
  external_reference: z.string().optional().describe('Your reference ID for tracking this payment'),
  callback_url: z.string().optional().describe('URL to receive payment confirmation updates via callback webhook'),
});
export type MpesaPaymentInput = z.infer<typeof MpesaPaymentInputSchema>;

const MpesaPaymentOutputSchema = z.object({
  success: z.boolean(),
  status: z.string().optional(),
  message: z.string(),
  customerMessage: z.string().optional(),
  data: z.any().optional(),
});
export type MpesaPaymentOutput = z.infer<typeof MpesaPaymentOutputSchema>;


export async function initiateMpesaPayment(input: MpesaPaymentInput): Promise<MpesaPaymentOutput> {
  return mpesaPaymentFlow(input);
}


const mpesaPaymentFlow = ai.defineFlow(
  {
    name: 'mpesaPaymentFlow',
    inputSchema: MpesaPaymentInputSchema,
    outputSchema: MpesaPaymentOutputSchema,
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
      const response = await fetch('https://lipia-api.kreativelabske.com/api/v2/payments/stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(input),
      });

      const result = await response.json();
      
      return result;

    } catch (error: any) {
      console.error('M-Pesa API request failed:', error);
      return {
        success: false,
        message: 'Failed to connect to payment service. Please try again later.',
        customerMessage: 'Could not connect to the payment gateway.',
      };
    }
  }
);

    