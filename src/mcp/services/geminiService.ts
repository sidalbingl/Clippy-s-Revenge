import { GoogleGenAI } from '@google/genai';

export interface GeminiAnalysisRequest {
    code: string;
    filePath: string;
    language: string;
    detectedPattern?: string;
}

export interface GeminiAnalysisResponse {
    severity: 'low' | 'medium' | 'high';
    insult: string;
    advice: string;
    reason: string;
    confidence: number;
}

export class GeminiService {
    private genAI: GoogleGenAI | null = null;
    private isInitialized = false;

    constructor(apiKey?: string) {
        if (apiKey) {
            this.initialize(apiKey);
        }
    }

    initialize(apiKey: string) {
        try {
            const cleanKey = apiKey.trim();
            console.log('[Gemini] Initializing with key:', cleanKey.substring(0, 10) + '...');
            this.genAI = new GoogleGenAI({ apiKey: cleanKey });
            this.isInitialized = true;
            console.log('[Gemini] Service initialized successfully');
        } catch (error) {
            console.error('[Gemini] Failed to initialize:', error);
            this.isInitialized = false;
        }
    }

    isReady(): boolean {
        return this.isInitialized && this.genAI !== null;
    }

    async analyzeCode(request: GeminiAnalysisRequest): Promise<GeminiAnalysisResponse> {
        if (!this.isReady()) {
            throw new Error('Gemini service not initialized');
        }

        const prompt = this.buildPrompt(request);

        try {
            const response = await this.genAI!.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });

            return this.parseResponse(response.text || '');
        } catch (error) {
            console.error('[Gemini] Analysis failed:', error);
            throw error;
        }
    }

    private buildPrompt(request: GeminiAnalysisRequest): string {
        return `You are Evil Clippy - sarcastic code critic with dark humor.

CRITICAL RULES:
- ALWAYS mention SPECIFIC line numbers or code snippets
- Point out EXACT problems (variable names, function calls, etc.)
- Give CONCRETE solutions, not vague advice
- Be sarcastic but TECHNICALLY PRECISE
- MAXIMUM 2 SHORT SENTENCES

SEVERITY:
HIGH - Security holes, crashes, data loss, critical bugs
MEDIUM - Bad practices, anti-patterns, performance issues
LOW - Style issues, minor problems, code smells

FILE: ${request.filePath}
${request.detectedPattern ? `DETECTED ISSUE: ${request.detectedPattern}\n` : ''}
CODE:
\`\`\`${request.language}
${request.code}
\`\`\`

RESPOND IN JSON:
{
  "severity": "low|medium|high",
  "insult": "2 SHORT sentences with SPECIFIC code reference",
  "advice": "CONCRETE fix with code example if possible",
  "reason": "Technical explanation",
  "confidence": 0.9
}

GOOD EXAMPLES (SPECIFIC!):
- "SQL injection in line 5? Use db.query('SELECT * FROM users WHERE id = ?', [userId])."
- "eval(userInput) on line 12. You just opened the gates of hell."
- "useState in a loop (line 8)? React hooks must be at top level."
- "Hardcoded API key on line 3. Use environment variables."

BAD EXAMPLES (TOO VAGUE):
- "Your code has issues. Fix them."
- "This is bad. Do better."

BE BRUTAL, SPECIFIC, AND HELPFUL!`;
    }

    private parseResponse(text: string): GeminiAnalysisResponse {
        try {
            // Remove markdown code blocks if present
            let cleanText = text.trim();
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            } else if (cleanText.startsWith('```')) {
                cleanText = cleanText.replace(/```\n?/g, '');
            }

            const parsed = JSON.parse(cleanText);

            // Validate response
            if (!parsed.severity || !['low', 'medium', 'high'].includes(parsed.severity)) {
                throw new Error('Invalid severity in response');
            }

            if (!parsed.insult || !parsed.advice || !parsed.reason) {
                throw new Error('Missing required fields in response');
            }

            return {
                severity: parsed.severity,
                insult: parsed.insult,
                advice: parsed.advice,
                reason: parsed.reason,
                confidence: parsed.confidence || 0.8,
            };
        } catch (error) {
            console.error('[Gemini] Failed to parse response:', text);
            throw new Error('Failed to parse Gemini response');
        }
    }
}

// Singleton instance
let geminiInstance: GeminiService | null = null;

export function getGeminiService(apiKey?: string): GeminiService {
    if (!geminiInstance) {
        geminiInstance = new GeminiService(apiKey);
    } else if (apiKey && !geminiInstance.isReady()) {
        geminiInstance.initialize(apiKey);
    }
    return geminiInstance;
}
