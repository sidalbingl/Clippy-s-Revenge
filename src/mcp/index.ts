import * as chokidar from 'chokidar';
import * as path from 'path';
import { analyzeCodeQuality, generateInsultMessage } from './analyzers/codeQualityAnalyzer';

export interface MCPEvent {
  type: 'INSULT_TRIGGER';
  severity: 'low' | 'medium' | 'high';
  filePath: string;
  message: string;
  emotion: 'idle' | 'annoyed' | 'furious';
  shouldLaugh?: boolean;
  laughReason?: string;
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
      
      const result = await analyzeCodeQuality(filePath);
      const message = generateInsultMessage(result, filePath);

      const emotionMap = {
        high: 'furious' as const,
        medium: 'annoyed' as const,
        low: 'idle' as const,
      };

      const event: MCPEvent = {
        type: 'INSULT_TRIGGER',
        severity: result.insultSeverity,
        filePath,
        message,
        emotion: emotionMap[result.insultSeverity],
        shouldLaugh: result.shouldTriggerLaugh,
        laughReason: result.laughMetadata?.laughReason,
      };

      console.log(`[MCP] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`[MCP] 📊 Severity: ${event.severity.toUpperCase()}`);
      console.log(`[MCP] 💬 Message: ${event.message}`);
      if (event.shouldLaugh) {
        console.log(`[MCP] 😈 LAUGH MODE: ${event.laughReason}`);
      } else {
        console.log(`[MCP] 🔇 No laugh (no embarrassing patterns)`);
      }
      console.log(`[MCP] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      if (this.eventCallback) {
        this.eventCallback(event);
      } else {
        console.warn('[MCP] No callback registered for events');
      }
    } catch (error) {
      console.error('[MCP] Error analyzing file:', error);
      
      // Send fallback event on error
      if (this.eventCallback) {
        const fallbackEvent: MCPEvent = {
          type: 'INSULT_TRIGGER',
          severity: 'low',
          filePath,
          message: "I tried to judge your code but it broke my analyzer. Impressive.",
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
