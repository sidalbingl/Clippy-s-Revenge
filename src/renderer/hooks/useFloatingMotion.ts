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

type MovementMode = 'normal' | 'dash' | 'lurk' | 'swoop';

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

  const getRandomPosition = (): Position => {
    const pad = padding || 50;
    return {
      x: pad + Math.random() * (window.innerWidth - pad * 2),
      y: pad + Math.random() * (window.innerHeight - pad * 2)
    };
  };

  const getEdgePosition = (): Position => {
    const edge = Math.floor(Math.random() * 4);
    const pad = padding || 50;

    switch (edge) {
      case 0: return { x: pad, y: pad + Math.random() * (window.innerHeight - pad * 2) };
      case 1: return { x: window.innerWidth - pad, y: pad + Math.random() * (window.innerHeight - pad * 2) };
      case 2: return { x: pad + Math.random() * (window.innerWidth - pad * 2), y: pad };
      case 3: return { x: pad + Math.random() * (window.innerWidth - pad * 2), y: window.innerHeight - pad };
      default: return getRandomPosition();
    }
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

  const chooseMovementMode = (): MovementMode => {
    const rand = Math.random();
    if (rand < 0.15) return 'dash';
    if (rand < 0.25) return 'lurk';
    if (rand < 0.35) return 'swoop';
    return 'normal';
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

    let easedProgress: number;
    const mode = movementModeRef.current;

    switch (mode) {
      case 'dash':
        easedProgress = easeInQuad(progress);
        break;
      case 'lurk':
        easedProgress = easeOutQuad(progress);
        break;
      case 'swoop':
        easedProgress = easeInOutBack(progress);
        break;
      default:
        easedProgress = easeInOutSine(progress);
    }

    const currentX = startPosRef.current.x +
      (targetPosRef.current.x - startPosRef.current.x) * easedProgress;
    const currentY = startPosRef.current.y +
      (targetPosRef.current.y - startPosRef.current.y) * easedProgress;

    const bobbing = mode === 'dash' ? 0 : getHoverBobbing(timestamp);

    setPosition({
      x: currentX,
      y: currentY + bobbing
    });

    if (progress >= 1) {
      startPosRef.current = { x: currentX, y: currentY };

      if (Math.random() < pauseChance) {
        isPausedRef.current = true;
        pauseStartRef.current = timestamp;
        setIsMoving(false);
      } else {
        movementModeRef.current = chooseMovementMode();

        if (movementModeRef.current === 'dash') {
          targetPosRef.current = getRandomPosition();
          durationRef.current = 800 + Math.random() * 600;
        } else if (movementModeRef.current === 'lurk') {
          targetPosRef.current = getEdgePosition();
          durationRef.current = 5000 + Math.random() * 3000;
        } else if (movementModeRef.current === 'swoop') {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          targetPosRef.current = {
            x: centerX + (Math.random() - 0.5) * 400,
            y: centerY + (Math.random() - 0.5) * 400
          };
          durationRef.current = 2000 + Math.random() * 1500;
        } else {
          targetPosRef.current = getRandomPosition();
          durationRef.current = minDuration + Math.random() * (maxDuration - minDuration);
        }

        startTimeRef.current = timestamp;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!enabled) return;

    const initialPos = getRandomPosition();
    startPosRef.current = initialPos;
    targetPosRef.current = getRandomPosition();
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
