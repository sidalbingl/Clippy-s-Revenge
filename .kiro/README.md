# Kiro Integration Overview – Clippy's Revenge

This project showcases AI-powered code analysis with Gemini 2.5 Flash, developed using Kiro IDE features.

## Project Overview
Evil Clippy is an Electron app that monitors your code in real-time and provides sarcastic, AI-generated feedback with visual effects.

## Key Technologies
- **AI**: Gemini 2.5 Flash for code analysis
- **Framework**: Electron + React + TypeScript
- **File Watching**: Chokidar
- **Styling**: Tailwind CSS + 98.css (Windows 95 theme)
- **Effects**: CSS animations + SVG filters

## Kiro Features Used

### 1. Spec-Driven Development
Specs in `/specs` guided the development:
- `persona_behavior.md` - AI personality and tone
- `mcp_server.md` - File watching and analysis pipeline
- `effects_system.md` - Visual effects (shake, glitch)
- `avatar_ui.md` - Clippy avatar and speech bubble

### 2. Steering Documents
`/steering/clippy_dark_persona.md` defines:
- Sarcastic tone guidelines
- Severity mapping
- Example responses
- Technical accuracy rules

### 3. AI Integration
- Gemini 2.5 Flash analyzes code
- Smart caching (15 min TTL)
- Rate limiting (10/min)
- Automatic fallback to local analysis

## Project Structure

```
.kiro/
├── specs/              # Development specifications
│   ├── persona_behavior.md
│   ├── mcp_server.md
│   ├── effects_system.md
│   └── avatar_ui.md
├── steering/           # AI behavior guidelines
│   └── clippy_dark_persona.md
└── README.md          # This file

src/
├── main/              # Electron main process
├── mcp/               # File watching + AI analysis
│   ├── analyzers/     # Smart analyzer + fallback
│   └── services/      # Gemini API, cache, rate limiter
└── renderer/          # React UI
    ├── components/    # Avatar, speech bubble
    └── hooks/         # State management, effects
```

## How It Works

1. **File Change** → Chokidar detects code changes
2. **AI Analysis** → Gemini 2.5 Flash analyzes code
3. **Severity** → AI determines low/medium/high
4. **Message** → AI generates sarcastic feedback
5. **Effects** → Visual effects based on severity
6. **Display** → Clippy shows message with animation

## Development Workflow

### Setup
```bash
npm install
# Add GEMINI_API_KEY to .env
npm run dev:renderer  # Terminal 1
npm start             # Terminal 2
```

### Customization
- **AI Prompt**: `src/mcp/services/geminiService.ts`
- **Personality**: `.kiro/steering/clippy_dark_persona.md`
- **Effects**: `src/renderer/hooks/effects/`
- **UI**: `src/renderer/components/`

## Key Features

- ✅ Real-time code monitoring
- ✅ AI-powered analysis (Gemini 2.5 Flash)
- ✅ Smart caching and rate limiting
- ✅ Local fallback when AI unavailable
- ✅ Sarcastic but helpful feedback
- ✅ Visual effects (shake, glitch, red flash)
- ✅ Sound effects
- ✅ Laugh detection for embarrassing code
- ✅ Windows 95 aesthetic

## Kiro Integration Benefits

1. **Spec-driven** - Clear requirements guided development
2. **Steering** - Consistent AI personality
3. **Modular** - Easy to extend and customize
4. **Well-documented** - Specs serve as documentation
5. **AI-first** - Leverages Gemini for smart analysis

This project demonstrates complete Kiro IDE integration for AI-powered development.
