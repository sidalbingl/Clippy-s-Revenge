# Clippy's Revenge

Evil Clippy haunts your code with AI-powered sarcastic commentary and visual effects.

## Features

- 🤖 **AI-Powered Analysis** - Gemini 2.5 Flash analyzes your code in real-time
- 😈 **Sarcastic Commentary** - Brutal but helpful feedback with dark humor
- 🎭 **Visual Effects** - Shake, glitch, and red flash based on severity
- 💬 **Smart Fallback** - Local analysis when AI is unavailable
- ⚡ **Fast & Cached** - Response caching and rate limiting
- 🎃 **Halloween Theme** - Spooky, dark aesthetic

## How It Works

### Complete Flow

```
User saves code file
    ↓
Chokidar detects change (src/mcp/index.ts)
    ↓
Smart Analyzer checks cache
    ↓
Gemini 2.5 Flash analyzes code (src/mcp/services/geminiService.ts)
    ├─ Determines severity (low/medium/high)
    ├─ Generates sarcastic message
    └─ Provides technical advice
    ↓
If Gemini fails → Local fallback (src/mcp/analyzers/codeQualityAnalyzer.ts)
    ↓
Result cached for 15 minutes
    ↓
Electron Main forwards via IPC (src/main/main.ts)
    ↓
Renderer receives event (src/renderer/hooks/useClippyState.ts)
    ↓
Clippy displays message with effects:
    - Low: Message only (12 seconds)
    - Medium: Message + Shake (10 seconds)
    - High: Message + Shake + Glitch + Red Flash (8 seconds)
```

## Project Structure

```
src/
├── main/
│   ├── main.ts          # Electron main process
│   └── preload.ts       # IPC bridge
├── mcp/
│   ├── index.ts         # File watcher + event dispatcher
│   ├── analyzers/
│   │   ├── smartAnalyzer.ts         # Gemini + fallback orchestrator
│   │   ├── codeQualityAnalyzer.ts   # Local fallback analysis
│   │   └── laughDetector.ts         # Embarrassing pattern detector
│   ├── services/
│   │   ├── geminiService.ts         # Gemini 2.5 Flash API client
│   │   ├── cacheService.ts          # Response caching (15 min TTL)
│   │   └── rateLimiter.ts           # Rate limiting (10/min)
│   └── responseEngine/
│       ├── index.ts                 # Fallback message generator
│       └── insults.ts               # Predefined insult collections
└── renderer/
    ├── App.tsx          # Main UI + effect orchestration
    ├── components/
    │   ├── Avatar.tsx           # Clippy avatar with animations
    │   └── SpeechBubble.tsx     # Speech bubble with typing effect
    └── hooks/
        ├── useClippyState.ts    # State management + event handling
        ├── useFloatingMotion.ts # Floating animation
        └── effects/
            ├── useShake.ts      # Shake effect hook
            ├── useGlitch.ts     # Glitch effect hook
            └── useSound.ts      # Sound effect hook
```

## AI Analysis

### Gemini 2.5 Flash
- **Model**: `gemini-2.5-flash` via `@google/genai` SDK
- **Prompt**: Sarcastic code critic with dark humor
- **Output**: Severity + 2 short sarcastic sentences + technical advice
- **Cache**: 15 minute TTL to reduce API calls
- **Rate Limit**: 10 requests per minute

### Severity Levels
- **HIGH**: Security vulnerabilities, crashes, data loss
- **MEDIUM**: Bad practices, anti-patterns
- **LOW**: Style issues, minor problems

### Fallback System
If Gemini fails (API down, rate limit, no key):
- Local regex-based analysis
- Predefined sarcastic messages
- Same severity detection logic

## Avatar & Effects

### Avatar States
- `idle` - Floating animation
- `analyzing` - Orange eyes
- `angry` - Red eyes, furious expression
- `inactivity_warning` - Bouncing animation

### Visual Effects
- **Shake**: Medium (450ms) or High (700ms) intensity
- **Glitch**: Color channel offset + hue rotation (600ms)
- **Red Flash**: Brief red overlay for high severity
- **Audio**: Severity-based sound effects

### Laugh Detection
Triggers special laugh animation for embarrassing patterns:
- Silly variable names (a, b, c, temp1, lol)
- Beginner mistakes (if(true), comparing to self)
- Meme variables (wtf, yolo, lmao)
- Console.log spam (10+ instances)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy the key

### 3. Configure Environment
Create `.env` file:
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MAX_REQUESTS_PER_MINUTE=10
GEMINI_CACHE_TTL_MINUTES=15
```

### 4. Run Development Mode
```bash
# Terminal 1: Start Vite dev server
npm run dev:renderer

# Terminal 2: Start Electron
npm start
```

This starts:
1. Vite dev server on http://localhost:5173
2. Electron app with hot reload
3. File watcher on current directory
4. Gemini API integration

### 5. Build for Production
```bash
npm run build
npm start
```

## Configuration

### Environment Variables
- `GEMINI_API_KEY` - Your Gemini API key (required for AI)
- `GEMINI_MAX_REQUESTS_PER_MINUTE` - Rate limit (default: 10)
- `GEMINI_CACHE_TTL_MINUTES` - Cache duration (default: 15)

### Watch Directory
- Dev mode: Auto-watches current directory
- Production: Can be configured via IPC

### Customizing Clippy's Personality
Edit `src/mcp/services/geminiService.ts` → `buildPrompt()` method:
- Change tone (more/less sarcastic)
- Adjust message length
- Add custom examples
- Modify severity rules

## Performance

- **Async Analysis**: Non-blocking file analysis
- **Smart Caching**: 15-minute cache reduces API calls
- **Rate Limiting**: 10 requests/minute prevents quota exhaustion
- **GPU Animations**: CSS-based effects for smooth performance
- **Debounced Watching**: 500ms stabilization prevents spam

## Troubleshooting

### Gemini Not Working
1. Check API key in `.env`
2. Verify key is active at https://aistudio.google.com
3. Check console for error messages
4. System will fallback to local analysis automatically

### Clippy Not Appearing
1. Ensure both `npm run dev:renderer` and `npm start` are running
2. Check Electron window is open (look in taskbar)
3. Try Alt+Tab to find the window

### Messages Too Fast/Slow
Edit `src/renderer/components/SpeechBubble.tsx` line 64:
```typescript
const displayDuration = emotion === 'furious' ? 8000 : emotion === 'annoyed' ? 10000 : 12000;
```

## License

MIT
