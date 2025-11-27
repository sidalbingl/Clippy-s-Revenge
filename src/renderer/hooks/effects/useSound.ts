import { useCallback, useRef } from 'react';

const RATE_LIMIT_MS = 3000; // 3 seconds

export function useSound(soundPath: string) {
  const lastPlayedRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    const now = Date.now();
    
    // Rate limiting
    if (now - lastPlayedRef.current < RATE_LIMIT_MS) {
      return;
    }

    try {
      // Create new audio instance if needed
      if (!audioRef.current) {
        audioRef.current = new Audio(soundPath);
        audioRef.current.volume = 0.3; // Not too loud
      }

      // Reset and play
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('Failed to play sound:', err);
      });

      lastPlayedRef.current = now;
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }, [soundPath]);

  return { play };
}
