import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface HighSeverityOverlayProps {
  isActive: boolean;
  onComplete: () => void;
  startEffect: boolean;
}

export const HighSeverityOverlay = ({ isActive, onComplete, startEffect }: HighSeverityOverlayProps) => {
  const [phase, setPhase] = useState<'hidden' | 'darkening' | 'intense' | 'fadeout'>('hidden');

  useEffect(() => {
    if (!isActive) {
      setPhase('hidden');
      return;
    }

    if (!startEffect) {
      return;
    }

    const timeline = [
      { delay: 0, action: () => setPhase('darkening') },
      { delay: 3000, action: () => setPhase('intense') },
      { delay: 5000, action: () => setPhase('fadeout') },
      { delay: 6500, action: () => { setPhase('hidden'); onComplete(); } }
    ];

    const timeouts = timeline.map(({ delay, action }) => 
      setTimeout(action, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [isActive, startEffect, onComplete]);

  if (phase === 'hidden') return null;

  const overlayContent = (
    <>
      {/* Elegant vignette darkening */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.95) 100%)',
          opacity: phase === 'darkening' || phase === 'intense' ? 1 : 0,
          transition: phase === 'fadeout' ? 'opacity 1500ms cubic-bezier(0.4, 0, 0.2, 1)' : 'opacity 2500ms cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
          zIndex: 9998
        }}
      />

      {/* Subtle chromatic aberration on intense phase */}
      {(phase === 'intense' || phase === 'fadeout') && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: phase === 'fadeout' ? 0 : 1,
            transition: phase === 'fadeout' ? 'opacity 1500ms cubic-bezier(0.4, 0, 0.2, 1)' : 'opacity 400ms ease-out',
            pointerEvents: 'none',
            zIndex: 9999,
            mixBlendMode: 'screen',
            background: 'radial-gradient(circle at center, rgba(255, 0, 0, 0.08) 0%, transparent 50%)',
            animation: 'breathe 3s ease-in-out infinite'
          }}
        />
      )}

      {/* Subtle edge glow */}
      {(phase === 'intense' || phase === 'fadeout') && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: phase === 'fadeout' ? 0 : 0.4,
            transition: phase === 'fadeout' ? 'opacity 1500ms cubic-bezier(0.4, 0, 0.2, 1)' : 'opacity 400ms ease-out',
            pointerEvents: 'none',
            zIndex: 10000,
            boxShadow: 'inset 0 0 200px rgba(139, 0, 0, 0.3)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      )}

      <style>{`
        @keyframes breathe {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: scale(1.05);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 0.3;
          }
          50% { 
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );

  return createPortal(overlayContent, document.body);
};
