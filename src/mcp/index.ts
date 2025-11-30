import * as chokidar from 'chokidar';
import * as path from 'path';
import { smartAnalyzer } from './analyzers/smartAnalyzer';
import { detectLaugh } from './analyzers/laughDetector';
import * as dotenv from 'dotenv';

// Load environment variables - override system env vars
dotenv.config({ override: true });

export interface MCPEvent {
  type: 'INSULT_TRIGGER';
  severity: 'low' | 'medium' | 'high';
  filePath: string;
  message: string;
  emotion: 'idle' | 'annoyed' | 'furious';
  shouldLaugh?: boolean;
  laughReason?: string;
  usedAI?: boolean;
  reason?: string;
}

type EventCallback = (event: MCPEvent) => void;

export class MCPWatcher {
  private watcher: chokidar.FSWatcher | null = null;
  private eventCallback: EventCallback | null = null;
  private watchPath: string;
  private isProcessing = false;

  constructor(watchPath: string) {
    this.watchPath = watchPath;
  }

  start(callback: EventCallback) {
    this.eventCallback = callback;

    // Initialize Gemini if API key is available
    const geminiApiKey = process.env.GEMINI_API_KEY;
    console.log('[MCP] API Key from env:', geminiApiKey ? geminiApiKey.substring(0, 15) + '...' : 'Not found');
    
    if (geminiApiKey) {
      smartAnalyzer.initializeGemini(geminiApiKey);
      console.log('[MCP] Gemini initialized');
    } else {
      console.log('[MCP] No Gemini API key found, using local analysis only');
    }

    this.watcher = chokidar.watch(this.watchPath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    });

    // Watch for file changes
    this.watcher.on('change', (filePath: string) => {
      if (this.shouldAnalyze(filePath)) {
        this.handleFileChange(filePath);
      }
    });

    // Watch for new files
    this.watcher.on('add', (filePath: string) => {
      if (this.shouldAnalyze(filePath)) {
        this.handleFileChange(filePath);
      }
    });

    console.log(`[MCP] Watching directory: ${this.watchPath}`);
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('[MCP] Watcher stopped');
    }
  }

  private shouldAnalyze(filePath: string): boolean {
    const ext = path.extname(filePath);
    return ['.js', '.ts', '.jsx', '.tsx', '.py'].includes(ext);
  }

  private async handleFileChange(filePath: string) {
    // Prevent concurrent analysis
    if (this.isProcessing) {
      console.log(`[MCP] Skipping ${filePath} - already processing`);
      return;
    }
    
    this.isProcessing = true;

    try {
      console.log(`[MCP] Analyzing: ${filePath}`);
      
      const laughResult = await detectLaugh(filePath);

      // Directly analyze with Gemini (no quick analysis)
      const result = await smartAnalyzer.analyze(filePath);
      
      console.log(`[MCP] Analysis complete: ${result.severity} (AI: ${result.usedAI})`);
      
      if (this.eventCallback) {
        const event: MCPEvent = {
          type: 'INSULT_TRIGGER',
          severity: result.severity,
          filePath,
          message: result.message,
          emotion: result.emotion,
          shouldLaugh: laughResult.shouldPlayLaugh,
          laughReason: laughResult.shouldPlayLaugh ? 'Embarrassing code detected' : undefined,
          usedAI: result.usedAI,
          reason: result.reason,
        };
        this.eventCallback(event);
      }
    } catch (error) {
      console.error('[MCP] Error analyzing file:', error);
      
      // Send fallback event on error
      if (this.eventCallback) {
        const fallbackEvent: MCPEvent = {
          type: 'INSULT_TRIGGER',
          severity: 'low',
          filePath,
          message: "Kodunu analiz etmeye çalıştım ama analizörümü bozdu. Etkileyici.",
          emotion: 'annoyed',
        };
        this.eventCallback(fallbackEvent);
      }
    } finally {
      // Add small delay to prevent spam
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    }
  }
}


