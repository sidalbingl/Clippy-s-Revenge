import { useEffect, useState, useRef } from 'react';
import { Avatar } from './components/Avatar';
import { SpeechBubble } from './components/SpeechBubble';
import { useClippyState } from './hooks/useClippyState';
import { useShake } from './hooks/effects/useShake';
import { useGlitch } from './hooks/effects/useGlitch';
import { useAudio } from './hooks/effects/useAudio';
import { useFloatingMotion } from './hooks/useFloatingMotion';

function App() {
  const { state, message, emotion, severity, shouldPlayAlone, shouldPlayLaugh } = useClippyState();
  const { shakeClass, triggerShake } = useShake();
  const { glitchClass, triggerGlitch } = useGlitch();
  const { playSound, playLaugh, playAlone } = useAudio();
  
  const [isDragging, setIsDragging] = useState(false);
  const [manualPosition, setManualPosition] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  
  const { position: autoPosition } = useFloatingMotion({
    enabled: !isDragging && !manualPosition,
    minDuration: 4000,
    maxDuration: 7000,
    padding: 100,
    pauseChance: 0.3,
    pauseDuration: 1500
  });

  const position = manualPosition || autoPosition;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    if ((window as any).electronAPI?.setIgnoreMouseEvents) {
      (window as any).electronAPI.setIgnoreMouseEvents(false);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const pad = 100;
      const newX = Math.max(pad, Math.min(window.innerWidth - pad, e.clientX - offsetRef.current.x));
      const newY = Math.max(pad, Math.min(window.innerHeight - pad, e.clientY - offsetRef.current.y));
      setManualPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      const distance = Math.sqrt(
        Math.pow(e.clientX - dragStartRef.current.x, 2) +
        Math.pow(e.clientY - dragStartRef.current.y, 2)
      );
      
      if (distance < 5) {
        setManualPosition(null);
      }
      
      setIsDragging(false);
      
      if ((window as any).electronAPI?.setIgnoreMouseEvents) {
        (window as any).electronAPI.setIgnoreMouseEvents(true);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!severity) return;
    
    try {
      playSound(severity);
      if (severity === 'high') {
        triggerShake('high');
        triggerGlitch();
      } else if (severity === 'medium') {
        triggerShake('medium');
      }
    } catch (error) {
      console.error('[App] Error triggering effects:', error);
    }
  }, [severity, triggerShake, triggerGlitch, playSound]);

  useEffect(() => {
    if (shouldPlayLaugh) playLaugh();
  }, [shouldPlayLaugh, playLaugh]);

  useEffect(() => {
    if (shouldPlayAlone) playAlone();
  }, [shouldPlayAlone, playAlone]);

  return (
    <div 
      className={`w-screen h-screen ${glitchClass}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'visible',
        pointerEvents: 'none'
      }}
    >
      <div 
        onMouseEnter={() => {
          if ((window as any).electronAPI?.setIgnoreMouseEvents) {
            (window as any).electronAPI.setIgnoreMouseEvents(false);
          }
        }}
        onMouseLeave={() => {
          if (!isDragging && (window as any).electronAPI?.setIgnoreMouseEvents) {
            (window as any).electronAPI.setIgnoreMouseEvents(true);
          }
        }}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: 'auto',
          zIndex: 9999
        }}
      >
        <div 
          onMouseDown={handleMouseDown}
          style={{ 
            position: 'relative',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
        >
          <Avatar state={state} enableFloating={false} />
        </div>
        
        <div 
          className={shakeClass}
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '12px',
            pointerEvents: 'auto',
            zIndex: 10
          }}
        >
          <SpeechBubble message={message} emotion={emotion} />
        </div>
      </div>
      
      {severity === 'high' && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 20
          }}
          className="animate-red-flash"
        />
      )}
    </div>
  );
}

export default App;
