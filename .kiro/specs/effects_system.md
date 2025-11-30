# Spec: Visual Effects System (Shake + Glitch)

## Purpose
Define UI effects triggered by AI-analyzed code severity.

## Effects

### 1. Shake Animation
Triggered on:
- `severity = "medium"`
- `severity = "high"`

Implementation:
- CSS keyframes (`transform: translateX`)
- Duration: 0.45–0.7s
- Intensity proportional to severity

### 2. Glitch Effect
Triggered on:
- `severity = "high"`

Effects:
- SVG noise overlay
- color channel offset
- brief red flash on UI

### 3. Sound Effects
- Severity-based sounds (low/medium/high)
- Throttled to prevent spam (300ms cooldown)
- Preloaded for instant playback

### Deliverables
- `src/renderer/hooks/effects/useShake.ts`
- `src/renderer/hooks/effects/useGlitch.ts`
- `src/renderer/hooks/effects/useSound.ts`
- `src/renderer/audio/AudioEngine.ts`
- `public/sounds/low.mp3`
- `public/sounds/medium.mp3`
- `public/sounds/high.mp3`
