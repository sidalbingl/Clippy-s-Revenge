import { useState, useCallback, useRef } from 'react';

interface UseGlitchReturn {
  isGlitching: boolean;
  glitchClass: string;
  triggerGlitch: () => void;
}

export function useGlitch(): UseGlitchReturn {
  const [isGlitching, setIsGlitching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerGlitch = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsGlitching(true);

    // Glitch effect lasts 600ms
    timeoutRef.current = setTimeout(() => {
      setIsGlitching(false);
    }, 600);
  }, []);

  const glitchClass = isGlitching ? 'animate-glitch' : '';

  return {
    isGlitching,
    glitchClass,
    triggerGlitch,
  };
}
