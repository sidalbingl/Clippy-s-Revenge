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

RULES:
- Be sarcastic and mocking
- Use dark/spooky metaphors
- MAXIMUM 2 SHORT SENTENCES (critical!)
- Be brutal but concise

SEVERITY:
HIGH - Security, crashes, data loss
MEDIUM - Bad practices, anti-patterns  
LOW - Style issues, minor problems

CODE:
${request.detectedPattern ? `Issue: ${request.detectedPattern}\n` : ''}\`\`\`
${request.code}
\`\`\`

JSON ONLY:
{"severity":"low|medium|high","insult":"2 SHORT sarcastic sentences","advice":"Quick fix","reason":"Why","confidence":0.9}

EXAMPLES (KEEP IT SHORT!):
- "SQL injection? Hackers will love this. Use parameterized queries."
- "eval() detected. You just opened the gates of hell."
- "Hooks in a loop? React docs exist for a reason."
- "console.log everywhere. Ever heard of a debugger?"

BE BRUTAL BUT BRIEF!`;
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
