import { useEffect, useCallback } from 'react';
import { audioEngine, SoundLevel } from '../../audio/AudioEngine';

/**
 * Hook for using the AudioEngine in React components
 */
export function useAudio() {
  // Initialize audio engine on mount
  useEffect(() => {
    audioEngine.initialize();
  }, []);

  const playSound = useCallback((level: SoundLevel) => {
    audioEngine.playSound(level);
  }, []);

  const playLaugh = useCallback(() => {
    audioEngine.playLaugh();
  }, []);

  const playAlone = useCallback(() => {
    audioEngine.playAlone();
  }, []);

  const stopAll = useCallback(() => {
    audioEngine.stopAll();
  }, []);

  const setVolume = useCallback((volume: number) => {
    audioEngine.setVolume(volume);
  }, []);

  return {
    playSound,
    playLaugh,
    playAlone,
    stopAll,
    setVolume,
  };
}
