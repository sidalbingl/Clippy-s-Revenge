# Spec: Evil Clippy Avatar UI

## Purpose
Define the UI behavior, animation rules, and layout for the resurrected “Evil Clippy” assistant.  
Kiro should use this spec to generate all UI components inside the Electron renderer.

## Requirements

### 1. Avatar Component
- Must display an SVG or PNG of Clippy with “dark mode / evil” theme.
- Eyes should glow red during “anger mode.”
- Avatar must animate slightly (hover, bounce, idle shake).

### 2. Speech Bubble
- Styled using a modified Windows 95 / 98 aesthetic.
- Dark version of 98.css (black background, red borders).
- Bubble should support:
  - multiline text
  - typewriter animation
  - auto-resize to content
  - fade-in and fade-out

### 3. Window Behavior
- Always on top.
- Transparent background.
- Frameless Electron window.
- Draggable area around Clippy.
- Position: bottom-right by default.

### 4. States
- `idle`
- `analyzing`
- `angry` (trigger shake + glitch effects)
- `inactivity_warning`

### 5. Animation Effects
- Shake effect (CSS keyframes).
- Glitch overlay (optional SVG filter).
- Eye glow pulse.

## Deliverables (expected from Kiro-generated code)
- `Avatar.tsx`
- `SpeechBubble.tsx`
- `useClippyState.ts`
- Tailwind or CSS module files containing animations
