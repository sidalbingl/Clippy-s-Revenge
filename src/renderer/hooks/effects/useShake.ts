import { useState, useCallback, useRef } from 'react';

export type ShakeIntensity = 'medium' | 'high';

interface UseShakeReturn {
  isShaking: boolean;
  shakeClass: string;
  triggerShake: (intensity?: ShakeIntensity) => void;
}

export function useShake(): UseShakeReturn {
  const [isShaking, setIsShaking] = useState(false);
  const [intensity, setIntensity] = useState<ShakeIntensity>('medium');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerShake = useCallback((shakeIntensity: ShakeIntensity = 'medium') => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIntensity(shakeIntensity);
    setIsShaking(true);

    const duration = shakeIntensity === 'high' ? 700 : 450;

    timeoutRef.current = setTimeout(() => {
      setIsShaking(false);
    }, duration);
  }, []);

  const shakeClass = isShaking 
    ? intensity === 'high' 
      ? 'animate-shake-intense' 
      : 'animate-shake'
    : '';

  return {
    isShaking,
    shakeClass,
    triggerShake,
  };
}
