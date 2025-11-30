# AudioEngine

Non-blocking audio system for Evil Clippy that plays sounds based on AI-analyzed code severity.

## Features

- **Preloaded sounds**: All audio files loaded at startup for instant playback
- **Non-blocking**: Uses HTML5 Audio API, doesn't block UI
- **Throttled**: Prevents sound spam with 300ms cooldown
- **Priority system**: High severity sounds can interrupt others
- **Volume control**: Adjustable master volume
- **Fail-safe**: Errors don't crash the app

## Usage

### In React Components

```typescript
import { useAudio } from '../hooks/effects/useAudio';

function MyComponent() {
  const { playSound, setVolume } = useAudio();
  
  // Play sound
  playSound('high');
  
  // Adjust volume (0.0 to 1.0)
  setVolume(0.5);
}
```

### Direct Usage

```typescript
import { audioEngine } from './AudioEngine';

// Initialize (done automatically by useAudio hook)
await audioEngine.initialize();

// Play sound
audioEngine.playSound('medium');

// Stop all sounds
audioEngine.stopAll();

// Set volume
audioEngine.setVolume(0.8);
```

## Sound Levels

### Low Severity
- **File**: `public/sounds/low.wav`
- **Duration**: ~0.1s
- **Volume**: 30%
- **Description**: Soft beep or click
- **Use case**: Minor issues, unused variables

### Medium Severity
- **File**: `public/sounds/medium.wav`
- **Duration**: ~0.3s
- **Volume**: 50%
- **Description**: Glitchy static sound
- **Use case**: Console logs, magic numbers

### High Severity
- **File**: `public/sounds/high.wav`
- **Duration**: ~0.5s
- **Volume**: 70%
- **Description**: Deep bass + distortion
- **Use case**: Nested loops, high complexity

## Throttling

Sounds are throttled to prevent overlap:
- **Cooldown**: 300ms between sounds
- **Exception**: High severity can interrupt other sounds
- **Behavior**: If a sound is already playing, new sounds are ignored (except high)

## Integration

The AudioEngine is integrated into the app's AI-powered severity system:

```
Code Issue Detected
    ↓
Gemini 2.5 Flash analyzes code
    ↓
Severity determined (low/medium/high)
    ↓
App.tsx receives severity
    ↓
playSound(severity) called
    ↓
Sound plays (non-blocking)
```

## Customizing Sounds

### Replace Sound Files

1. Create or download better sound effects
2. Replace files in `public/sounds/`:
   - `low.wav`
   - `medium.wav`
   - `high.wav`
3. Restart the app

### Recommended Tools

- [Bfxr](https://www.bfxr.net/) - Retro sound effects generator
- [ChipTone](https://sfbgames.itch.io/chiptone) - 8-bit sound maker
- [Audacity](https://www.audacityteam.org/) - Audio editor

### Sound Guidelines

**Low:**
- Short (0.1-0.2s)
- Soft, subtle
- Simple tone

**Medium:**
- Medium length (0.3-0.5s)
- Glitchy, distorted
- Moderate volume

**High:**
- Longer (0.5-1s)
- Deep, aggressive
- Loud and impactful

## API Reference

### `audioEngine.initialize()`
Preloads all sound files. Called automatically by `useAudio` hook.

**Returns**: `Promise<void>`

### `audioEngine.playSound(level)`
Plays sound for the given severity level.

**Parameters**:
- `level`: `'low' | 'medium' | 'high'`

**Returns**: `void`

### `audioEngine.stopAll()`
Stops all currently playing sounds.

**Returns**: `void`

### `audioEngine.setVolume(volume)`
Sets master volume for all sounds.

**Parameters**:
- `volume`: `number` (0.0 to 1.0)

**Returns**: `void`

## Performance

- **Initialization**: ~100-200ms (one-time at startup)
- **Playback**: <1ms (instant, non-blocking)
- **Memory**: ~50KB for all sound files
- **CPU**: Negligible (handled by browser's audio engine)

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Audio API
- Promises
- ES6+

## Troubleshooting

### Sounds not playing

1. Check browser console for errors
2. Verify sound files exist in `public/sounds/`
3. Check browser audio permissions
4. Try adjusting volume: `setVolume(1.0)`

### Sounds delayed

- Sounds are preloaded, so there should be no delay
- If delay persists, check network tab for loading issues

### Sounds too loud/quiet

```typescript
// Adjust master volume
audioEngine.setVolume(0.5); // 50% volume
```

## Testing

Use Dev Controls to test each sound level:
1. Click [DEV] button
2. Click [LOW], [MED], or [HIGH] Test
3. Listen for corresponding sound

## Future Enhancements

- [ ] Add more sound variations
- [ ] Implement sound themes (retro, modern, horror)
- [ ] Add user preference for volume
- [ ] Support for custom sound packs
- [ ] Spatial audio effects
