import fs from 'fs';
import path from 'path';
import type { QuizData } from './quiz-types';

const CACHE_PATH = path.join(process.cwd(), '.quiz-cache.json');

interface CacheEntry {
  fingerprint: string;
  generatedAt: string;
  generator: 'ai' | 'template';
  data: QuizData;
}

export function readCache(fingerprint: string): QuizData | null {
  try {
    if (!fs.existsSync(CACHE_PATH)) return null;

    const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
    const entry: CacheEntry = JSON.parse(raw);

    if (entry.fingerprint === fingerprint) {
      console.log(`[quiz-cache] Hit (generator: ${entry.generator}, from: ${entry.generatedAt})`);
      return entry.data;
    }

    console.log('[quiz-cache] Miss (fingerprint changed)');
    return null;
  } catch {
    console.log('[quiz-cache] Miss (read error)');
    return null;
  }
}

export function writeCache(
  fingerprint: string,
  data: QuizData,
  generator: 'ai' | 'template',
): void {
  try {
    const entry: CacheEntry = {
      fingerprint,
      generatedAt: new Date().toISOString(),
      generator,
      data,
    };
    fs.writeFileSync(CACHE_PATH, JSON.stringify(entry, null, 2));
    console.log(`[quiz-cache] Written (generator: ${generator})`);
  } catch (error) {
    console.warn('[quiz-cache] Failed to write cache:', error);
  }
}
