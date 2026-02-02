import { z } from 'zod';
import type { QuizData } from './quiz-types';

// ── Zod schema for AI response validation ────────────────────────
const QuizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  source: z.string(),
  sourceUrl: z.string().startsWith('/'),
});

const QuizPermutationSchema = z.object({
  id: z.number(),
  questions: z.array(QuizQuestionSchema).length(5),
});

const QuizDataSchema = z.object({
  permutations: z.array(QuizPermutationSchema).length(4),
});

// ── Post-processing: shuffle options to fix correctIndex bias ────
function shuffleQuizOptions(data: QuizData): QuizData {
  return {
    permutations: data.permutations.map((perm) => ({
      ...perm,
      questions: perm.questions.map((q, qi) => {
        // Deterministic seed per question so results are stable
        const seed = perm.id * 100 + qi;
        const correctAnswer = q.options[q.correctIndex];
        // Fisher-Yates with seeded PRNG
        const shuffled = [...q.options];
        let s = seed;
        for (let i = shuffled.length - 1; i > 0; i--) {
          s = (s * 1664525 + 1013904223) & 0xffffffff;
          const j = (s >>> 0) % (i + 1);
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return {
          ...q,
          options: shuffled,
          correctIndex: shuffled.indexOf(correctAnswer),
        };
      }),
    })),
  };
}

// ── JSON extraction strategies ───────────────────────────────────
function extractJSON(text: unknown): unknown | null {
  if (typeof text !== 'string') return null;
  // Strategy 1: direct parse
  try {
    return JSON.parse(text);
  } catch {
    // continue
  }

  // Strategy 2: extract from code fences
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // continue
    }
  }

  // Strategy 3: find first { to last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch {
      // continue
    }
  }

  return null;
}

// ── System prompt ────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a quiz question generator. You generate quiz questions about a person based on facts from their portfolio website.

RULES:
- Generate EXACTLY 4 permutations of 5 questions each
- Each permutation has an "id" (0-3) and a "questions" array
- Tier distribution per permutation:
  - Permutation 0: 3 easy, 2 medium, 0 hard
  - Permutation 1: 2 easy, 2 medium, 1 hard
  - Permutation 2: 1 easy, 2 medium, 2 hard
  - Permutation 3: 0 easy, 2 medium, 3 hard
- Each question has: id (string), question (string), options (array of exactly 4 strings), correctIndex (0-3), source (string), sourceUrl (string starting with /)
- RANDOMIZE correctIndex position — do NOT always put the answer at index 0
- Use ONLY facts from the provided content — do not invent facts
- Generate plausible but INCORRECT distractors for wrong answers
- Vary questions across permutations — avoid repeating the same question
- sourceUrl must be one of: /, /projects, /resume, /journal
- source should describe where the info comes from (e.g. "From the Resume page")
- Return RAW JSON only — no markdown fences, no explanation, no extra text
- The JSON must have this exact shape: { "permutations": [...] }`;

// ── API caller ───────────────────────────────────────────────────
interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callWorkersAI(
  messages: AIMessage[],
  temperature: number,
): Promise<string | null> {
  const accountId = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_AI_API_TOKEN;

  if (!accountId || !apiToken) {
    console.log('[quiz-ai] Missing CF_ACCOUNT_ID or CF_AI_API_TOKEN, skipping AI generation');
    return null;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        temperature,
        max_tokens: 3072,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[quiz-ai] API error ${response.status}: ${text}`);
      return null;
    }

    const result = await response.json();
    const content = result?.result?.response;
    if (typeof content === 'string') return content;
    // Some models return the response in a different structure
    if (typeof content === 'object' && content !== null) {
      console.log('[quiz-ai] Response was object, stringifying');
      return JSON.stringify(content);
    }
    console.warn('[quiz-ai] Unexpected response shape:', JSON.stringify(result).slice(0, 200));
    return null;
  } catch (error) {
    console.error('[quiz-ai] API request failed:', error);
    return null;
  }
}

// ── Main export ──────────────────────────────────────────────────
export async function generateAIQuizData(
  contentSummary: string,
): Promise<QuizData | null> {
  const messages: AIMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Here is the content from Noah's portfolio site. Generate the quiz JSON based on these facts:\n\n${contentSummary}`,
    },
  ];

  // Attempt 1
  console.log('[quiz-ai] Generating quiz questions via Cloudflare Workers AI...');
  const response1 = await callWorkersAI(messages, 0.7);
  if (!response1) return null;

  const json1 = extractJSON(response1);
  if (json1) {
    const parsed1 = QuizDataSchema.safeParse(json1);
    if (parsed1.success) {
      console.log('[quiz-ai] Successfully generated and validated quiz data');
      return shuffleQuizOptions(parsed1.data);
    }
    console.warn('[quiz-ai] Validation failed on attempt 1:', parsed1.error.issues.slice(0, 3));
  } else {
    console.warn('[quiz-ai] Failed to extract JSON on attempt 1');
  }

  // Attempt 2: retry with correction message
  console.log('[quiz-ai] Retrying with correction...');
  const retryMessages: AIMessage[] = [
    ...messages,
    { role: 'assistant', content: response1 },
    {
      role: 'user',
      content:
        'Your response was not valid JSON matching the required schema. Please try again. Return ONLY raw JSON with exactly 4 permutations of 5 questions each. Each question needs exactly 4 options and correctIndex must be 0-3. sourceUrl must start with /. No markdown fences.',
    },
  ];

  const response2 = await callWorkersAI(retryMessages, 0.3);
  if (!response2) return null;

  const json2 = extractJSON(response2);
  if (json2) {
    const parsed2 = QuizDataSchema.safeParse(json2);
    if (parsed2.success) {
      console.log('[quiz-ai] Successfully generated and validated quiz data on retry');
      return shuffleQuizOptions(parsed2.data);
    }
    console.warn('[quiz-ai] Validation failed on attempt 2:', parsed2.error.issues.slice(0, 3));
  } else {
    console.warn('[quiz-ai] Failed to extract JSON on attempt 2');
  }

  console.log('[quiz-ai] Both attempts failed, returning null for fallback');
  return null;
}
