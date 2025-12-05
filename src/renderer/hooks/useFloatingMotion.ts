import { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface ClippyMotionConfig {
  enabled?: boolean;
  minDuration?: number;
  maxDuration?: number;
  padding?: number;
  pauseChance?: number;
  pauseDuration?: number;
}

type MovementMode = 'normal' | 'dash' | 'lurk' | 'swoop' | 'avoid';

export const useFloatingMotion = (config: ClippyMotionConfig = {}) => {
  const {
    enabled = true,
    minDuration = 3000,
    maxDuration = 6000,
    padding = 150,
    pauseChance = 0.25,
    pauseDuration = 2000
  } = config;

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(true);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const startPosRef = useRef<Position>({ x: 0, y: 0 });
  const targetPosRef = useRef<Position>({ x: 0, y: 0 });
  const durationRef = useRef<number>(4000);
  const isPausedRef = useRef<boolean>(false);
  const pauseStartRef = useRef<number>(0);
  const movementModeRef = useRef<MovementMode>('normal');
  const mousePositionRef = useRef<Position>({ x: 0, y: 0 });
  const lastAvoidTimeRef = useRef<number>(0);

  const getCornerPosition = (): Position => {
    const pad = 20; // Small padding from edges
    const avatarWidth = 176 * 0.7; // Avatar width * scale
    const avatarHeight = 208 * 0.7; // Avatar height * scale

    const corners = [
      { x: pad, y: pad }, // Top-left
      { x: window.innerWidth - avatarWidth - pad, y: pad }, // Top-right
      { x: pad, y: window.innerHeight - avatarHeight - pad }, // Bottom-left
      { x: window.innerWidth - avatarWidth - pad, y: window.innerHeight - avatarHeight - pad }, // Bottom-right
    ];

    return corners[Math.floor(Math.random() * corners.length)];
  };



  const easeInOutSine = (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  };

  const easeInQuad = (t: number): number => {
    return t * t;
  };

  const easeOutQuad = (t: number): number => {
    return t * (2 - t);
  };

  const easeInOutBack = (t: number): number => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  };

  const getHoverBobbing = (time: number): number => {
    return Math.sin(time * 0.003) * 5;
  };



  const animate = (timestamp: number) => {
    if (!enabled) return;

    if (startTimeRef.current === 0) {
      startTimeRef.current = timestamp;
    }

    if (isPausedRef.current) {
      const pauseElapsed = timestamp - pauseStartRef.current;
      if (pauseElapsed >= pauseDuration) {
        isPausedRef.current = false;
        startTimeRef.current = timestamp;
        setIsMoving(true);
      } else {
        const bobbing = getHoverBobbing(timestamp);
        setPosition({
          x: startPosRef.current.x,
          y: startPosRef.current.y + bobbing
        });
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / durationRef.current, 1);

    // Simple smooth easing
    const easedProgress = easeInOutSine(progress);

    const currentX = startPosRef.current.x +
      (targetPosRef.current.x - startPosRef.current.x) * easedProgress;
    const currentY = startPosRef.current.y +
      (targetPosRef.current.y - startPosRef.current.y) * easedProgress;

    const bobbing = getHoverBobbing(timestamp);

    setPosition({
      x: currentX,
      y: currentY + bobbing
    });

    if (progress >= 1) {
      startPosRef.current = { x: currentX, y: currentY };

      // Always pause at corners
      isPausedRef.current = true;
      pauseStartRef.current = timestamp;
      setIsMoving(false);

      // Next target is another corner
      targetPosRef.current = getCornerPosition();
      durationRef.current = 4000 + Math.random() * 3000; // Slow movement
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!enabled) return;

    const initialPos = getCornerPosition();
    startPosRef.current = initialPos;
    targetPosRef.current = getCornerPosition();
    setPosition(initialPos);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled]);

  return { position, isMoving };
};
