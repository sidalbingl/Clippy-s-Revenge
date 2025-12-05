import * as chokidar from 'chokidar';
import * as path from 'path';
import { smartAnalyzer } from './analyzers/smartAnalyzer';
import * as dotenv from 'dotenv';

// Load environment variables - override system env vars
dotenv.config({ override: true });

export interface MCPEvent {
  type: 'INSULT_TRIGGER';
  severity: 'low' | 'medium' | 'high';
  filePath: string;
  message: string;
  emotion: 'idle' | 'annoyed' | 'furious';
  usedAI?: boolean;
  reason?: string;
}

type EventCallback = (event: MCPEvent) => void;

export interface WatcherConfig {
  folders: string[];
  files?: string[]; // Individual files to watch
  fileTypes: string[]; // e.g., ['.js', '.ts', '.jsx']
  watchSubfolders: boolean;
}

export class MCPWatcher {
  private watcher: chokidar.FSWatcher | null = null;
  private eventCallback: EventCallback | null = null;
  private config: WatcherConfig;
  private isProcessing = false;

  constructor(config: WatcherConfig) {
    this.config = config;
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

    // Build ignore patterns
    const ignorePatterns = [
      /(^|[\/\\])\../, // dotfiles
      /node_modules/,
      /\.git/,
      /dist/,
      /build/,
      /coverage/,
      /\.next/,
      /\.nuxt/,
    ];

    // Combine folders and individual files
    const watchPaths = [
      ...this.config.folders,
      ...(this.config.files || [])
    ];

    // Watch multiple folders and files
    this.watcher = chokidar.watch(watchPaths, {
      ignored: ignorePatterns,
      persistent: true,
      ignoreInitial: true,
      depth: this.config.watchSubfolders ? undefined : 0,
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

    console.log(`[MCP] Watching ${this.config.folders.length} folder(s) and ${(this.config.files || []).length} file(s)`);
    console.log(`[MCP] File types: ${this.config.fileTypes.join(', ')}`);
    console.log(`[MCP] Subfolders: ${this.config.watchSubfolders ? 'Yes' : 'No'}`);
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('[MCP] Watcher stopped');
    }
  }

  private shouldAnalyze(filePath: string): boolean {
    // If it's a directly watched file, always analyze it
    if (this.config.files && this.config.files.includes(filePath)) {
      return true;
    }
    
    // Otherwise check file type
    const ext = path.extname(filePath);
    return this.config.fileTypes.includes(ext);
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


