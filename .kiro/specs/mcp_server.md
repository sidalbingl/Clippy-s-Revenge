# Spec: MCP Server for AI-Powered Code Monitoring

## Purpose
File watcher that monitors code changes and triggers Gemini AI analysis for real-time feedback.

## Architecture

### 1. File Watching (Chokidar)
Monitors:
- File extensions: `.js`, `.ts`, `.jsx`, `.tsx`, `.py`
- Events: `change`, `add`
- Debounce: 500ms stabilization
- Ignores: dotfiles, node_modules

### 2. Analysis Pipeline
```
File Change Detected
    ↓
Smart Analyzer (src/mcp/analyzers/smartAnalyzer.ts)
    ↓
Check Cache (15 min TTL)
    ↓
Gemini 2.5 Flash Analysis
    ├─ Severity: low/medium/high
    ├─ Message: 2 sarcastic sentences
    └─ Advice: Technical fix
    ↓
If Gemini Fails → Local Fallback
    ↓
Cache Result
    ↓
Send to Renderer via IPC
```

### 3. Gemini Integration
**Service**: `src/mcp/services/geminiService.ts`
- Model: `gemini-2.5-flash`
- SDK: `@google/genai`
- Prompt: Sarcastic code critic
- Response: JSON with severity + message

**Features**:
- Response caching (15 min)
- Rate limiting (10/min)
- Automatic fallback
- Error handling

### 4. Event Structure
```typescript
{
  type: "INSULT_TRIGGER",
  severity: "low" | "medium" | "high",
  filePath: string,
  message: string,
  emotion: "idle" | "annoyed" | "furious",
  usedAI: boolean,
  shouldLaugh?: boolean
}
```

### 5. Performance
- **Async**: Non-blocking analysis
- **Cached**: Reduces API calls
- **Rate Limited**: Prevents quota exhaustion
- **Fallback**: Always works even without AI

## Implementation Files
- `src/mcp/index.ts` - Main watcher
- `src/mcp/analyzers/smartAnalyzer.ts` - Gemini orchestrator
- `src/mcp/analyzers/codeQualityAnalyzer.ts` - Local fallback
- `src/mcp/services/geminiService.ts` - AI client
- `src/mcp/services/cacheService.ts` - Response cache
- `src/mcp/services/rateLimiter.ts` - Rate limiting

## Configuration
Environment variables (`.env`):
```env
GEMINI_API_KEY=your_key_here
GEMINI_MAX_REQUESTS_PER_MINUTE=10
GEMINI_CACHE_TTL_MINUTES=15
```
