import * as crypto from 'crypto';
import { GeminiAnalysisResponse } from './geminiService';

interface CacheEntry {
  response: GeminiAnalysisResponse;
  timestamp: number;
}

export class CacheService {
  private cache = new Map<string, CacheEntry>();
  private ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  generateKey(code: string, filePath: string): string {
    const hash = crypto.createHash('md5');
    hash.update(code + filePath);
    return hash.digest('hex');
  }

  get(key: string): GeminiAnalysisResponse | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    console.log('[Cache] Hit:', key.substring(0, 8));
    return entry.response;
  }

  set(key: string, response: GeminiAnalysisResponse): void {
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
    console.log('[Cache] Stored:', key.substring(0, 8));
  }

  clear(): void {
    this.cache.clear();
    console.log('[Cache] Cleared');
  }

  size(): number {
    return this.cache.size;
  }
}

export const cacheService = new CacheService(5);
