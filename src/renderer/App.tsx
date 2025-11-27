import { useEffect } from 'react';
import { Avatar } from './components/Avatar';
import { SpeechBubble } from './components/SpeechBubble';
import { DevControls } from './components/DevControls';
import { useClippyState } from './hooks/useClippyState';
import { useShake } from './hooks/effects/useShake';
import { useGlitch } from './hooks/effects/useGlitch';
import { useAudio } from './hooks/effects/useAudio';

function App() {
  const { state, message, emotion, severity, shouldPlayAlone, shouldPlayLaugh } = useClippyState();
  const { shakeClass, triggerShake } = useShake();
  const { glitchClass, triggerGlitch } = useGlitch();
  const { playSound, playLaugh, playAlone } = useAudio();

  // Trigger effects based on severity
  useEffect(() => {
    if (!severity) return;

    console.log(`[App] Triggering effects for severity: ${severity}`);
    
    try {
      // Play appropriate sound
      playSound(severity);

      // Visual effects
      if (severity === 'high') {
        triggerShake('high');
        triggerGlitch();
      } else if (severity === 'medium') {
        triggerShake('medium');
      }
      // Low severity: just sound and message
    } catch (error) {
      console.error('[App] Error triggering effects:', error);
    }
  }, [severity, triggerShake, triggerGlitch, playSound]);

  // Trigger laugh sound for mocking mode
  useEffect(() => {
    if (shouldPlayLaugh) {
      console.log('[App] 🎃 Playing scary laugh - embarrassing code detected!');
      playLaugh();
    }
  }, [shouldPlayLaugh, playLaugh]);

  // Trigger alone sound for inactivity
  useEffect(() => {
    if (shouldPlayAlone) {
      console.log('[App] User inactive - playing "where are you" sound');
      playAlone();
    }
  }, [shouldPlayAlone, playAlone]);

  return (
    <div className={`w-screen h-screen flex flex-col items-center justify-end p-4 ${glitchClass} relative`}>
      {/* Dev controls for testing */}
      {process.env.NODE_ENV === 'development' && <DevControls />}
      
      {/* Main Clippy container */}
      <div className={`flex flex-col items-center ${shakeClass} relative z-10`}>
        <SpeechBubble message={message} emotion={emotion} />
        <Avatar state={state} />
      </div>
      
      {/* Red flash overlay for high severity */}
      {severity === 'high' && (
        <div className="fixed inset-0 pointer-events-none animate-red-flash z-20" />
      )}
      
      {/* CRT scanline effect */}
      <div 
        className="fixed top-0 left-0 w-full h-1 bg-gradient-to-b from-white/10 to-transparent pointer-events-none animate-scanline z-30"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
}

export default App;
