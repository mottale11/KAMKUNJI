
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
  phone: z.string().describe('The phone number to send the STK push to, in the format 07XXXXXXXX.'),
  amount: z.number().describe('The amount to be paid.'),
});
export type MpesaPaymentInput = z.infer<typeof MpesaPaymentInputSchema>;

const MpesaPaymentOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
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
    if (!apiKey || apiKey === "your_mpesa_api_key_here") {
      console.error("M-Pesa API key is not configured.");
      return {
        success: false,
        message: 'Server configuration error: M-Pesa API key is missing.',
      };
    }

    try {
      const response = await fetch('https://lipia-api.kreativelabske.com/api/request/stk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          phone: input.phone,
          amount: String(input.amount),
        }),
      });

      const result = await response.json();

      if (response.ok && result.message === "callback received successfully") {
        return {
          success: true,
          message: 'Payment request sent successfully. Please check your phone to complete the payment.',
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: result.message || 'An unknown error occurred during payment.',
          data: result,
        };
      }
    } catch (error) {
      console.error('M-Pesa API request failed:', error);
      return {
        success: false,
        message: 'Failed to connect to payment service. Please try again later.',
      };
    }
  }
);
