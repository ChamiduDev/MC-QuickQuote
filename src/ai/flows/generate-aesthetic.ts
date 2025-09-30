// src/ai/flows/generate-aesthetic.ts
'use server';

/**
 * @fileOverview Generates a complementary color scheme, font recommendations,
 * and overall aesthetic based on the user's company logo.
 *
 * - generateAesthetic - A function that generates the aesthetic.
 * - GenerateAestheticInput - The input type for the generateAesthetic function.
 * - GenerateAestheticOutput - The return type for the generateAesthetic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateAestheticInputSchema = z.object({
  logoDataUri: z
    .string()
    .describe(
      "A photo of a company logo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().optional().describe('Optional prompt for further customization.'),
});
export type GenerateAestheticInput = z.infer<typeof GenerateAestheticInputSchema>;

const GenerateAestheticOutputSchema = z.object({
  colorScheme: z
    .array(z.string())
    .describe('An array of complementary colors in hex format.'),
  fontRecommendation: z.string().describe('A recommended font family.'),
  overallAesthetic: z
    .string()
    .describe('A description of the overall aesthetic and style.'),
});
export type GenerateAestheticOutput = z.infer<typeof GenerateAestheticOutputSchema>;

export async function generateAesthetic(input: GenerateAestheticInput): Promise<GenerateAestheticOutput> {
  return generateAestheticFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAestheticPrompt',
  input: {schema: GenerateAestheticInputSchema},
  output: {schema: GenerateAestheticOutputSchema},
  prompt: `You are a branding expert. Based on the company logo provided, generate a complementary color scheme, font recommendation, and overall aesthetic that aligns with the brand identity.

Logo: {{media url=logoDataUri}}

Optional Prompt: {{{prompt}}}

Output the color scheme as an array of hex codes. Provide a single font recommendation. Describe the overall aesthetic in a few sentences.
`,
});

const generateAestheticFlow = ai.defineFlow(
  {
    name: 'generateAestheticFlow',
    inputSchema: GenerateAestheticInputSchema,
    outputSchema: GenerateAestheticOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
