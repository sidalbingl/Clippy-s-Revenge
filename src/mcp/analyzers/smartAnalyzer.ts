import * as fs from 'fs';
import * as path from 'path';
import { getGeminiService, GeminiAnalysisResponse } from '../services/geminiService';
import { cacheService } from '../services/cacheService';
import { rateLimiter } from '../services/rateLimiter';
import { analyzeCodeQuality, generateInsultMessage } from './codeQualityAnalyzer';

export interface SmartAnalysisResult {
  severity: 'low' | 'medium' | 'high';
  message: string;
  emotion: 'idle' | 'annoyed' | 'furious';
  usedAI: boolean;
  reason?: string;
}

export class SmartAnalyzer {
  private geminiService = getGeminiService();

  initializeGemini(apiKey: string) {
    this.geminiService.initialize(apiKey);
  }

  async getQuickAnalysis(filePath: string): Promise<SmartAnalysisResult & { willUpgrade: boolean }> {
    // ALWAYS try Gemini first if available
    const willUpgrade = this.geminiService.isReady() && rateLimiter.canMakeRequest();
    
    if (willUpgrade) {
      // Return a placeholder, Gemini will provide the real result
      return {
        severity: 'low',
        message: 'Analyzing...',
        emotion: 'idle',
        usedAI: false,
        reason: 'Waiting for Gemini',
        willUpgrade: true,
      };
    }
    
    // Only use local if Gemini is not available
    const localResult = await this.localAnalysis(filePath);
    return {
      ...localResult,
      willUpgrade: false,
    };
  }

  async analyze(filePath: string): Promise<SmartAnalysisResult> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const language = this.detectLanguage(filePath);

      // Check cache first
      const cacheKey = cacheService.generateKey(content, filePath);
      const cached = cacheService.get(cacheKey);
      
      if (cached) {
        return this.formatResponse(cached, true, 'cache');
      }

      // ALWAYS try Gemini first if available
      if (this.geminiService.isReady() && rateLimiter.canMakeRequest()) {
        try {
          const snippet = this.extractRelevantSnippet(content);
          const detectedPattern = this.detectPattern(content);

          rateLimiter.recordRequest();
          
          const geminiResponse = await this.geminiService.analyzeCode({
            code: snippet,
            filePath,
            language,
            detectedPattern,
          });

          // Cache the result
          cacheService.set(cacheKey, geminiResponse);

          return this.formatResponse(geminiResponse, true, 'gemini');
        } catch (error) {
          console.error('[SmartAnalyzer] Gemini failed, falling back to local:', error);
          return await this.localAnalysis(filePath);
        }
      }

      // Fallback to local only if Gemini is not available
      console.log('[SmartAnalyzer] Gemini not available, using local analysis');
      return await this.localAnalysis(filePath);
    } catch (error) {
      console.error('[SmartAnalyzer] Analysis failed:', error);
      return this.getErrorFallback(filePath);
    }
  }

  private shouldUseGemini(content: string): boolean {
    // Use Gemini for complex cases
    const complexityIndicators = [
      /useState.*\(.*for\s*\(/i,  // Hooks in loops
      /eval\s*\(/i,  // eval usage
      /innerHTML\s*=/i,  // XSS risk
      /SELECT.*FROM.*WHERE.*\$\{/i,  // SQL injection
      /password.*=.*['"`]/i,  // Hardcoded passwords
      /for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)\s*{[^}]*for/i,  // Triple nested loops
    ];

    return complexityIndicators.some(pattern => pattern.test(content));
  }

  private detectLanguage(filePath: string): string {
    const ext = path.extname(filePath);
    const langMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
    };
    return langMap[ext] || 'javascript';
  }

  private extractRelevantSnippet(content: string, maxLines: number = 50): string {
    const lines = content.split('\n');
    if (lines.length <= maxLines) return content;
    
    // Return first 50 lines (or find problematic section)
    return lines.slice(0, maxLines).join('\n') + '\n// ... (truncated)';
  }

  private detectPattern(content: string): string | undefined {
    if (/useState.*\(.*for\s*\(/i.test(content)) return 'React hooks in loop';
    if (/eval\s*\(/i.test(content)) return 'eval() usage';
    if (/innerHTML\s*=/i.test(content)) return 'innerHTML assignment';
    if (/SELECT.*FROM.*WHERE.*\$\{/i.test(content)) return 'SQL injection risk';
    if (/console\.(log|warn|error)/g.test(content)) return 'Debug console statements';
    return undefined;
  }

  private async localAnalysis(filePath: string): Promise<SmartAnalysisResult> {
    const result = await analyzeCodeQuality(filePath);
    const message = generateInsultMessage(result, filePath);

    const emotionMap = {
      high: 'furious' as const,
      medium: 'annoyed' as const,
      low: 'idle' as const,
    };

    return {
      severity: result.insultSeverity,
      message,
      emotion: emotionMap[result.insultSeverity],
      usedAI: false,
      reason: 'Local regex analysis',
    };
  }

  private formatResponse(
    geminiResponse: GeminiAnalysisResponse,
    usedAI: boolean,
    source: 'gemini' | 'cache'
  ): SmartAnalysisResult {
    const emotionMap = {
      high: 'furious' as const,
      medium: 'annoyed' as const,
      low: 'idle' as const,
    };

    // Combine insult + advice
    const message = `${geminiResponse.insult} ${geminiResponse.advice}`;

    console.log(`[SmartAnalyzer] Response from ${source}: ${geminiResponse.severity} (confidence: ${geminiResponse.confidence})`);

    return {
      severity: geminiResponse.severity,
      message,
      emotion: emotionMap[geminiResponse.severity],
      usedAI,
      reason: geminiResponse.reason,
    };
  }

  private getErrorFallback(filePath: string): SmartAnalysisResult {
    return {
      severity: 'low',
      message: "I tried to analyze your code but something went wrong. Spooky.",
      emotion: 'idle',
      usedAI: false,
      reason: 'Error fallback',
    };
  }
}

export const smartAnalyzer = new SmartAnalyzer();
