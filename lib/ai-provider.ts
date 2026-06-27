/**
 * Shared AI Provider Utility
 * 
 * Implements a dual-provider fallback strategy:
 *   1. Try Groq (primary) via fetchWithQuotaChecking
 *   2. If Groq fails (429 rate limit, network error, or missing key), try Google Gemini
 *   3. If both fail, return null so the caller can use its own static fallback text
 */

import { fetchWithQuotaChecking } from '@/lib/quota-monitor';

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.groq_api_key;
const GROQ_MODEL = 'llama-3.3-70b-specdec';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.gemini_api_key;
const GEMINI_MODEL = 'gemini-2.0-flash-lite';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface AIRequestOptions {
  prompt: string;
  systemPrompt?: string;
  messages?: { role: string; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

/**
 * Calls Groq first, falls back to Gemini, returns null if both fail.
 */
export async function callAIWithFallback(options: AIRequestOptions): Promise<string | null> {
  const { prompt, systemPrompt, messages, temperature = 0.5, maxTokens = 150 } = options;

  // --- Attempt 1: Groq ---
  if (GROQ_API_KEY) {
    try {
      const groqMessages = messages
        ? messages
        : [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt },
          ];

      const response = await fetchWithQuotaChecking('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: groqMessages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) {
          console.log('[AI Provider] Groq response received successfully.');
          return text;
        }
      }
      // If response is not ok (e.g. 429), we fall through to Gemini
      console.warn(`[AI Provider] Groq returned status ${response.status}. Falling back to Gemini...`);
    } catch (error: any) {
      console.warn(`[AI Provider] Groq call failed: ${error.message}. Falling back to Gemini...`);
    }
  } else {
    console.log('[AI Provider] No Groq API key. Trying Gemini...');
  }

  // --- Attempt 2: Google Gemini ---
  if (GEMINI_API_KEY) {
    try {
      // Build Gemini request body
      const geminiContents: any[] = [];

      if (messages && messages.length > 0) {
        // Convert OpenAI-style messages to Gemini format
        for (const msg of messages) {
          geminiContents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          });
        }
      } else {
        // Simple single-turn
        const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        geminiContents.push({
          role: 'user',
          parts: [{ text: fullPrompt }],
        });
      }

      const geminiBody = {
        contents: geminiContents,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      };

      const geminiUrl = `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          console.log('[AI Provider] Gemini response received successfully.');
          return text;
        }
      }

      console.warn(`[AI Provider] Gemini returned status ${response.status}.`);
    } catch (error: any) {
      console.error(`[AI Provider] Gemini call failed: ${error.message}`);
    }
  } else {
    console.log('[AI Provider] No Gemini API key configured either.');
  }

  // --- Both providers failed ---
  console.warn('[AI Provider] All AI providers exhausted. Returning null.');
  return null;
}
