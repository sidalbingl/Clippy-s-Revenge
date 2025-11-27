# Clippy's Revenge

Evil Clippy haunts your code with sarcastic commentary and visual effects.

## Event Pipeline

### Complete Flow

```
User saves file
    ↓
Chokidar detects change (src/mcp/index.ts)
    ↓
Code Quality Analyzer runs (src/mcp/analyzers/codeQualityAnalyzer.ts)
    ↓
Generates severity + insult message
    ↓
MCPWatcher callback fires
    ↓
Electron Main Process forwards via IPC (src/main/main.ts)
    ↓
Renderer receives event (src/renderer/hooks/useClippyState.ts)
    ↓
State updates trigger effects (src/renderer/App.tsx)
    ↓
Visual effects applied:
    - Low: Message only
    - Medium: Message + Shake
    - High: Message + Shake + Glitch + Red Flash
```

## Project Structure

```
src/
├── main/
│   ├── main.ts          # Electron main process + MCP integration
│   └── preload.ts       # IPC bridge
├── mcp/
│   ├── index.ts         # File watcher + event dispatcher
│   ├── analyzers/
│   │   └── codeQualityAnalyzer.ts  # Code analysis logic
│   └── responseEngine/
│       ├── index.ts                # Response generation engine
│       ├── insults.ts              # Predefined insult collections
│       ├── responseEngine.test.ts  # Unit tests
│       ├── example.ts              # Usage examples
│       └── README.md               # Engine documentation
└── renderer/
    ├── App.tsx          # Main UI + effect orchestration
    ├── components/
    │   ├── Avatar.tsx           # Clippy avatar with animations
    │   ├── SpeechBubble.tsx     # Win95-style speech bubble
    │   └── DevControls.tsx      # Testing controls (dev only)
    └── hooks/
        ├── useClippyState.ts    # State management + event handling
        └── effects/
            ├── useShake.ts      # Shake effect hook
            ├── useGlitch.ts     # Glitch effect hook
            └── useSound.ts      # Sound effect hook (optional)
```

## Features

### Avatar States
- `idle` - Floating animation
- `analyzing` - Orange eyes, medium concern
- `angry` - Red eyes, angry expression
- `inactivity_warning` - Bouncing animation

### Effects System
- **Shake**: Medium (450ms) or High (700ms) intensity
- **Glitch**: Color channel offset + hue rotation (600ms)
- **Red Flash**: Brief red overlay for high severity
- **Audio**: Severity-based sound effects (low beep, medium glitch, high bass)

### Code Analysis
Checks for:
- Console logs
- Magic numbers
- Nested loops/conditionals
- Function complexity
- Multiple return statements

### Response Engine
- **Deterministic**: Fast, no API calls
- **Modular**: Easy to extend with AI later
- **Context-aware**: Selects insults based on specific issues
- **Severity-based**: Different insult pools for low/medium/high
- **Testable**: Pure functions with unit tests

## Development

### Install
```bash
npm install
```

### Run Dev Mode
```bash
npm run dev
```

This starts:
1. Vite dev server (renderer)
2. Electron app with hot reload
3. MCP watcher on current directory

### Test Events
In dev mode, use the "Dev" button in top-right to manually trigger events.

### Build
```bash
npm run build
```

## Configuration

### Watch Directory
- Dev mode: Auto-watches current directory
- Production: Use IPC to select directory via dialog

### Severity Mapping
- **Low**: Simple issues (unused vars, etc.)
- **Medium**: Console logs, magic numbers, moderate complexity
- **High**: Nested loops, high complexity, multiple issues

## Fallback Logic

### Error Handling
- Invalid events → Logged and ignored
- Analysis errors → Fallback insult sent
- Missing window → Event queued/dropped
- Rate limiting → 1 second cooldown between analyses

### Default Messages
If MCP doesn't provide a message, defaults are used based on severity.

## Performance

- Async file analysis (non-blocking)
- CSS-based animations (GPU accelerated)
- Rate limiting prevents spam
- Debounced file watching (500ms stabilization)

## License

MIT


## Response Engine

The response engine generates sarcastic insults based on code quality issues. It's fully deterministic and requires no external API calls.

### Architecture

- **Pure functions**: All logic is deterministic and testable
- **Modular design**: Easy to swap with AI-based system later
- **Priority-based selection**: Chooses most relevant insult for detected issues
- **Extensible**: Simple to add new insult categories

### Usage

```typescript
import { generateResponse } from './mcp/responseEngine';

const response = generateResponse('high', {
  containsConsoleLogs: true,
  hasNestedLoops: true,
});

console.log(response);
// { message: "Nested loops? Bold move. Wrong, but bold.", emotion: "furious" }
```

### Insult Categories

Each severity level has 6 categories:
- General insults
- Console log specific
- Magic number specific
- Complexity specific
- Nested loop specific
- Long function specific

### Future AI Integration

The response engine is designed to be easily replaced with an AI-based system:

```typescript
// Future implementation
async function generateAIResponse(severity, metadata) {
  try {
    return await callLLM(severity, metadata);
  } catch (error) {
    // Fallback to deterministic engine
    return generateResponse(severity, metadata);
  }
}
```

See `src/mcp/responseEngine/README.md` for detailed documentation.
