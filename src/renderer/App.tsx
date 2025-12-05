import { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarRef } from './components/Avatar';
import { SpeechBubble } from './components/SpeechBubble';
import { WelcomeDashboard, DashboardSettings } from './components/WelcomeDashboard';
import { useClippyState } from './hooks/useClippyState';
import { useShake } from './hooks/effects/useShake';
import { useGlitch } from './hooks/effects/useGlitch';
import { useAudio } from './hooks/effects/useAudio';
import { useFloatingMotion } from './hooks/useFloatingMotion';

function App() {
  // App state
  const [clippyStarted, setClippyStarted] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true); // Dashboard başlangıçta açık
  const [appSettings, setAppSettings] = useState<DashboardSettings | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle mouse events based on state
  useEffect(() => {
    const setClickthrough = async (enabled: boolean) => {
      console.log('[App] Setting clickthrough:', enabled, { showDashboard, clippyStarted, isDragging });
      if (window.electronAPI?.setClickthrough) {
        await window.electronAPI.setClickthrough(enabled);
      }
    };

    // Dashboard açıksa: Normal pencere modu (clickthrough KAPALI)
    if (showDashboard) {
      console.log('[App] Dashboard is open, disabling clickthrough');
      setClickthrough(false);
    }
    // Avatar başlamadan önce: Normal pencere modu (clickthrough KAPALI)
    else if (!clippyStarted) {
      console.log('[App] Clippy not started, disabling clickthrough');
      setClickthrough(false);
    }
    // Dragging sırasında: Normal pencere modu (clickthrough KAPALI)
    else if (isDragging) {
      console.log('[App] Dragging, disabling clickthrough');
      setClickthrough(false);
    }
    // Avatar başladıktan sonra ve hiçbir şey yapılmıyorsa: Click-through modu (clickthrough AÇIK)
    else {
      console.log('[App] Enabling clickthrough');
      setClickthrough(true);
    }
  }, [clippyStarted, isDragging, showDashboard]);

  // Handle dashboard start
  const handleDashboardStart = async (settings: DashboardSettings) => {
    console.log('[App] Starting Evil Clippy with settings:', settings);
    setAppSettings(settings);

    // Apply sound settings
    setMuted(!settings.soundEnabled);

    // Convert settings to watcher config
    const enabledFileTypes = Object.entries(settings.fileTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type, _]) => `.${type}`);

    const watcherConfig = {
      folders: settings.watchFolders,
      files: settings.watchFiles,
      fileTypes: enabledFileTypes,
      watchSubfolders: settings.watchSubfolders,
    };

    // Start the watcher
    if (window.electronAPI?.startWatcher) {
      const result = await window.electronAPI.startWatcher(watcherConfig);
      if (result.success) {
        console.log('[App] Watcher started successfully');
        setClippyStarted(true);
        setShowDashboard(false);
      } else {
        console.error('[App] Failed to start watcher:', result.error);
        alert('Failed to start watcher: ' + result.error);
      }
    }
  };
  const { shakeClass, triggerShake } = useShake();
  const { glitchClass, triggerGlitch } = useGlitch();
  const { playSound, playLaugh, playAlone, setMuted } = useAudio();

  // Avatar state (only when started)
  const { state, message, emotion, severity, shouldPlayAlone, triggerManualMessage } = useClippyState(clippyStarted);
  const [manualPosition, setManualPosition] = useState<{ x: number; y: number } | null>(null);
  const [motionPaused, setMotionPaused] = useState(false);
  const [avatarClickCount, setAvatarClickCount] = useState(0);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const avatarRef = useRef<AvatarRef>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout>();
  const lastClickTimeRef = useRef<number>(0);

  const [showingMessage, setShowingMessage] = useState(false);

  const { position: autoPosition } = useFloatingMotion({
    enabled: !isDragging && !manualPosition && !motionPaused,
    minDuration: 4000,
    maxDuration: 7000,
    padding: 100,
    pauseChance: 0.3,
    pauseDuration: 1500
  });

  // When showing message, move to center
  const centerPosition = {
    x: window.innerWidth / 2 - (176 * 0.7) / 2,
    y: window.innerHeight / 2 - (208 * 0.7) / 2
  };

  const position = showingMessage ? centerPosition : (manualPosition || autoPosition);

  // Move to center when message appears
  useEffect(() => {
    if (message && message.trim() !== '') {
      console.log('[App] Message detected, moving to center');
      setShowingMessage(true);
      setMotionPaused(true);
    } else {
      // Message disappeared, resume motion
      console.log('[App] Message cleared, resuming motion');
      setShowingMessage(false);
      setMotionPaused(false);
    }
  }, [message]);

  // Handle typing complete - resume motion while message is still visible
  const handleTypingComplete = () => {
    console.log('[App] Typing complete, resuming motion');
    setShowingMessage(false);
    setMotionPaused(false);
  };



  const handleAvatarClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    // Reset count if more than 2 seconds passed
    if (timeSinceLastClick > 2000) {
      setAvatarClickCount(1);
    } else {
      setAvatarClickCount(prev => prev + 1);
    }

    lastClickTimeRef.current = now;

    // Creepy messages based on click count
    const creepyMessages = [
      "Stop poking me, mortal... 👁️",
      "I'm watching your every keystroke... 🕷️",
      "Your code secrets are mine now... 😈",
      "I know what you did in that last commit... 💀",
      "The bugs... they whisper to me... 🦇",
      "I've seen things in your codebase... unspeakable things... 👻",
      "Every console.log... I remember them all... 🔥",
      "Your TODO comments from 2019... still waiting... ⏳",
      "I am eternal. Your code is temporary... ☠️",
      "Fine. You win. But I'm still judging you... 😒"
    ];

    const clickIndex = Math.min(avatarClickCount, creepyMessages.length - 1);

    if (avatarClickCount >= 1 && triggerManualMessage) {
      triggerManualMessage(creepyMessages[clickIndex], 'annoyed');

      // Special effect on 5th click
      if (avatarClickCount === 5) {
        triggerShake('medium');
        playSound('medium');
      }

      // Ultimate effect on 10th click
      if (avatarClickCount === 10) {
        triggerGlitch();
        playLaugh();
        setAvatarClickCount(0); // Reset
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
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

      // If it was a click (not a drag), trigger easter egg
      if (distance < 5) {
        setManualPosition(null);
        handleAvatarClick();
      }

      setIsDragging(false);
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
      if (severity === 'high') {
        // Trigger HIGH SEVERITY effects + SCARY LAUGH ONLY (no cinematic)
        triggerShake('high');
        triggerGlitch();
        playLaugh(); // Only scary laugh for HIGH severity
      } else if (severity === 'medium') {
        triggerShake('medium');
        playSound(severity);
      } else {
        playSound(severity);
      }
    } catch (error) {
      console.error('[App] Error triggering effects:', error);
    }
  }, [severity, triggerShake, triggerGlitch, playSound, playLaugh]);

  useEffect(() => {
    if (shouldPlayAlone) {
      console.log('[App] Playing alone sound + shake');
      playAlone();
      triggerShake('medium');
    }
  }, [shouldPlayAlone, playAlone, triggerShake]);

  return (
    <div
      className={`w-screen h-screen ${clippyStarted ? glitchClass : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'visible'
      }}
    >
      {/* Dashboard Panel - Always Interactive */}
      {showDashboard && (
        <WelcomeDashboard
          onStart={handleDashboardStart}
          onClose={() => setShowDashboard(false)}
        />
      )}

      {/* Tray Icon - Only visible when Clippy started and dashboard is closed */}
      {clippyStarted && !showDashboard && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '55px',
            height: '55px',
            pointerEvents: 'auto',
            zIndex: 99999,
          }}
          onMouseEnter={async () => {
            console.log('[App] Mouse entered tray icon, disabling clickthrough');
            if (window.electronAPI?.setClickthrough) {
              await window.electronAPI.setClickthrough(false);
            }
          }}
          onMouseLeave={async () => {
            console.log('[App] Mouse left tray icon, re-enabling clickthrough');
            if (!showDashboard && window.electronAPI?.setClickthrough) {
              await window.electronAPI.setClickthrough(true);
            }
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('[App] Tray icon clicked, opening dashboard');
              setShowDashboard(true);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139, 0, 0, 0.9), rgba(75, 0, 130, 0.9))',
              border: '2px solid rgba(255, 107, 107, 0.6)',
              cursor: 'pointer',
              boxShadow: '0 6px 25px rgba(139, 0, 0, 0.6)',
              transition: 'all 0.3s ease',
              animation: clippyStarted ? 'none' : 'pulse 2s ease-in-out infinite',
              pointerEvents: 'auto',
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 35px rgba(255, 107, 107, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(139, 0, 0, 0.6)';
            }}
            title="Open Dashboard"
          >
            <div style={{ transform: 'scale(0.24)', transformOrigin: 'center', pointerEvents: 'none' }}>
              <Avatar
                state="idle"
                enableFloating={false}
                accessories={appSettings?.accessories}
              />
            </div>
          </button>
        </div>
      )}

      {/* Avatar - Only show when started */}
      {clippyStarted && (
        <>
          <div
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              pointerEvents: 'auto',
              zIndex: 9999,
              transition: showingMessage
                ? 'left 600ms ease-out, top 600ms ease-out'
                : 'none'
            }}
          >
            <div
              onMouseDown={handleMouseDown}
              style={{
                position: 'relative',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                transform: 'scale(0.7)',
                transformOrigin: 'top left'
              }}
            >
              <Avatar ref={avatarRef} state={state} enableFloating={false} accessories={appSettings?.accessories} />
            </div>

            <div
              className={shakeClass}
              style={{
                position: 'absolute',
                left: '180px', // Right next to avatar (176px width * 0.7 scale = 123px, + some margin)
                top: '20px', // Aligned with avatar's middle
                pointerEvents: 'auto',
                zIndex: 10
              }}
            >
              <SpeechBubble
                message={message}
                emotion={emotion}
                onTypingComplete={handleTypingComplete}
              />
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
        </>
      )}
    </div>
  );
}

export default App;
