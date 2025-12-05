/**
 * AudioEngine - Non-blocking audio system for Evil Clippy
 * Preloads sounds and plays them based on severity level and behavior
 */

export type SoundLevel = 'low' | 'medium' | 'high';
export type SpecialSound = 'laugh' | 'alone';

// Audio file mapping
const audioMap = {
  low: '/sounds/lowwrong.wav',
  medium: '/sounds/mediumwrong.wav',
  high: '/sounds/highwrong.wav',
  laugh: '/sounds/scarylaugh.wav',
  alone: '/sounds/whereareyou.wav',
};

interface AudioCache {
  low: HTMLAudioElement;
  medium: HTMLAudioElement;
  high: HTMLAudioElement;
  laugh: HTMLAudioElement;
  alone: HTMLAudioElement;
}

class AudioEngine {
  private audioCache: AudioCache | null = null;
  private isInitialized = false;
  private lastPlayTime = 0;
  private readonly THROTTLE_MS = 300; // Minimum time between sounds
  private currentlyPlaying: HTMLAudioElement | null = null;
  private isMuted = false;

  /**
   * Initialize and preload all audio files
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create audio elements and preload
      this.audioCache = {
        low: this.createAudio(audioMap.low, 0.4),
        medium: this.createAudio(audioMap.medium, 0.6),
        high: this.createAudio(audioMap.high, 0.8),
        laugh: this.createAudio(audioMap.laugh, 0.7),
        alone: this.createAudio(audioMap.alone, 0.6),
      };

      // Preload all sounds
      await Promise.all([
        this.preloadAudio(this.audioCache.low),
        this.preloadAudio(this.audioCache.medium),
        this.preloadAudio(this.audioCache.high),
        this.preloadAudio(this.audioCache.laugh),
        this.preloadAudio(this.audioCache.alone),
      ]);

      this.isInitialized = true;
      console.log('[AudioEngine] Initialized and custom sounds preloaded');
    } catch (error) {
      console.warn('[AudioEngine] Failed to initialize:', error);
      // Fail silently - audio is not critical
    }
  }

  /**
   * Create an audio element with volume
   */
  private createAudio(src: string, volume: number): HTMLAudioElement {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.preload = 'auto';
    return audio;
  }

  /**
   * Preload an audio file
   */
  private preloadAudio(audio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
      audio.addEventListener('canplaythrough', () => resolve(), { once: true });
      audio.addEventListener('error', () => resolve(), { once: true }); // Resolve even on error
      audio.load();
    });
  }

  /**
   * Set mute state
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.currentlyPlaying) {
      this.stopAll();
    }
  }

  /**
   * Play sound based on severity level
   */
  playSound(level: SoundLevel): void {
    if (!this.isInitialized || !this.audioCache || this.isMuted) {
      return;
    }

    const now = Date.now();
    const timeSinceLastPlay = now - this.lastPlayTime;

    // Throttle sounds to prevent overlap
    if (timeSinceLastPlay < this.THROTTLE_MS) {
      // High severity can interrupt
      if (level !== 'high') {
        return;
      }
    }

    // Stop currently playing sound if high severity
    if (level === 'high' && this.currentlyPlaying) {
      this.currentlyPlaying.pause();
      this.currentlyPlaying.currentTime = 0;
    }

    const audio = this.audioCache[level];
    
    try {
      // Reset and play
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn('[AudioEngine] Play failed:', error);
        // Fail silently - audio is not critical
      });

      this.currentlyPlaying = audio;
      this.lastPlayTime = now;
    } catch (error) {
      console.warn('[AudioEngine] Error playing sound:', error);
    }
  }

  /**
   * Stop all sounds
   */
  stopAll(): void {
    if (!this.audioCache) return;

    Object.values(this.audioCache).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    this.currentlyPlaying = null;
  }

  /**
   * Play scary laugh sound (for mocking mode)
   * Triggered when code is extremely bad or multiple issues detected
   */
  playLaugh(): void {
    if (!this.isInitialized || !this.audioCache || this.isMuted) {
      return;
    }

    const now = Date.now();
    const timeSinceLastPlay = now - this.lastPlayTime;

    // Throttle laugh sound (minimum 2 seconds between laughs)
    if (timeSinceLastPlay < 2000) {
      return;
    }

    // Stop any currently playing sound
    if (this.currentlyPlaying) {
      this.currentlyPlaying.pause();
      this.currentlyPlaying.currentTime = 0;
    }

    const audio = this.audioCache.laugh;
    
    try {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn('[AudioEngine] Laugh play failed:', error);
      });

      this.currentlyPlaying = audio;
      this.lastPlayTime = now;
      console.log('[AudioEngine] Playing scary laugh - mocking mode activated');
    } catch (error) {
      console.warn('[AudioEngine] Error playing laugh:', error);
    }
  }

  /**
   * Play "where are you" sound (for inactivity)
   * Triggered after 2 minutes of user inactivity
   * Limited to 10 seconds duration
   */
  playAlone(): void {
    if (!this.isInitialized || !this.audioCache || this.isMuted) {
      return;
    }

    const now = Date.now();
    const timeSinceLastPlay = now - this.lastPlayTime;

    // Throttle alone sound (minimum 1 minute between plays)
    if (timeSinceLastPlay < 60000) {
      return;
    }

    // Stop any currently playing sound
    if (this.currentlyPlaying) {
      this.currentlyPlaying.pause();
      this.currentlyPlaying.currentTime = 0;
    }

    const audio = this.audioCache.alone;
    
    try {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn('[AudioEngine] Alone play failed:', error);
      });

      this.currentlyPlaying = audio;
      this.lastPlayTime = now;
      
      // Stop after 10 seconds
      setTimeout(() => {
        if (this.currentlyPlaying === audio) {
          audio.pause();
          audio.currentTime = 0;
          this.currentlyPlaying = null;
        }
      }, 10000);
      
      console.log('[AudioEngine] Playing "where are you" (10s max) - user inactive');
    } catch (error) {
      console.warn('[AudioEngine] Error playing alone sound:', error);
    }
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    if (!this.audioCache) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    this.audioCache.low.volume = clampedVolume * 0.4;
    this.audioCache.medium.volume = clampedVolume * 0.6;
    this.audioCache.high.volume = clampedVolume * 0.8;
    this.audioCache.laugh.volume = clampedVolume * 0.7;
    this.audioCache.alone.volume = clampedVolume * 0.6;
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();
