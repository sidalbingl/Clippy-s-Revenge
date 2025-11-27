# Spec: Visual Effects System (Shake + Glitch)

## Purpose
Define UI effects triggered by MCP events.

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
- Retro Windows XP/95 error sound
- Played only once every 3 seconds (rate limiter)

### Deliverables
- `effects/useShake.ts`
- `effects/useGlitch.ts`
- `sounds/error.wav`
