import { useState, useEffect, useCallback } from 'react';

export type ClippyState = 'idle' | 'analyzing' | 'angry' | 'inactivity_warning';
export type Severity = 'low' | 'medium' | 'high';
export type Emotion = 'idle' | 'annoyed' | 'furious';

export interface InsultEvent {
  type: 'INSULT_TRIGGER';
  severity: Severity;
  filePath: string;
  message?: string;
  emotion?: Emotion;
  shouldLaugh?: boolean;
  laughReason?: string;
}

const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes for "where are you" sound + message
const LONG_INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes for harsher messages
const EMOTION_RESET_TIMEOUT = 8000; // 8 seconds to reset emotion after high severity

const INACTIVITY_MESSAGES_SHORT = [
  "Hello? Anyone there? 👻",
  "Did you fall asleep on your keyboard? 😴",
  "Where did you go? Your code misses you... 🕷️",
  "I'm getting lonely here... 🦇",
];

const INACTIVITY_MESSAGES_LONG = [
  "Still there? Should I call an ambulance for your productivity? 💀",
  "I've seen glaciers move faster than your coding. ❄️",
  "Taking a nap? Don't worry, your bugs will wait. 😈",
  "Is this a coffee break or a career break? ☕",
  "Your TODO list is growing while you're gone... 📝",
];

export function useClippyState(enabled: boolean = true) {
  const [state, setState] = useState<ClippyState>('idle');
  const [message, setMessage] = useState<string>('');
  const [emotion, setEmotion] = useState<Emotion>('idle');
  const [severity, setSeverity] = useState<Severity>('low');
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [shouldPlayAlone, setShouldPlayAlone] = useState(false);
  const [shouldPlayLaugh, setShouldPlayLaugh] = useState(false);
  const [emotionResetTimer, setEmotionResetTimer] = useState<NodeJS.Timeout | null>(null);

  const updateState = useCallback((
    newState: ClippyState,
    newMessage: string,
    newEmotion: Emotion = 'idle',
    newSeverity: Severity = 'low'
  ) => {
    setState(newState);
    setMessage(newMessage);
    setEmotion(newEmotion);
    setSeverity(newSeverity);
    setLastActivityTime(Date.now());
    setShouldPlayAlone(false); // Reset alone flag on activity
  }, []);

  // Inactivity detection with two-stage system
  useEffect(() => {
    if (!enabled) return; // Don't run if not enabled
    
    const checkInactivity = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityTime;

      // Stage 1: Play "where are you" sound + show light message after 2 minutes
      if (timeSinceActivity >= INACTIVITY_TIMEOUT && timeSinceActivity < INACTIVITY_TIMEOUT + 30000) {
        if (!shouldPlayAlone && state !== 'inactivity_warning') {
          setShouldPlayAlone(true);
          const randomMessage = INACTIVITY_MESSAGES_SHORT[Math.floor(Math.random() * INACTIVITY_MESSAGES_SHORT.length)];
          updateState('inactivity_warning', randomMessage, 'idle', 'low');
          console.log('[Clippy] User inactive for 2 minutes - playing sound + showing message');
        }
      }

      // Stage 2: Show harsher message after 5 minutes
      if (timeSinceActivity >= LONG_INACTIVITY_TIMEOUT) {
        const randomMessage = INACTIVITY_MESSAGES_LONG[Math.floor(Math.random() * INACTIVITY_MESSAGES_LONG.length)];
        updateState('inactivity_warning', randomMessage, 'annoyed', 'medium');
        console.log('[Clippy] User inactive for 5 minutes - showing harsh message');
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInactivity);
  }, [enabled, lastActivityTime, state, shouldPlayAlone, updateState]);

  // Listen for insult events from MCP
  useEffect(() => {
    if (!enabled) return; // Don't listen if not enabled
    
    if (!window.electronAPI) {
      console.warn('[Clippy] electronAPI not available');
      return;
    }

    const handleInsultEvent = (data: InsultEvent) => {
      if (!enabled) return; // Ignore events if not enabled
      
      try {
        // Validate event data
        if (!data || !data.severity) {
          console.error('[Clippy] Invalid event data:', data);
          return;
        }

        const { severity: eventSeverity, message: msg, emotion: eventEmotion } = data;

        // Fallback messages if MCP doesn't provide one
        const defaultMessages: Record<Severity, string> = {
          high: "This code is the real horror story here.",
          medium: "Are you trying to summon undefined behavior?",
          low: "I've seen interns write better variable names.",
        };

        const displayMessage = msg || defaultMessages[eventSeverity] || "Your code needs work.";

        // Map severity to emotion if not provided
        const emotionMap: Record<Severity, Emotion> = {
          high: 'furious',
          medium: 'annoyed',
          low: 'idle',
        };

        const displayEmotion = eventEmotion || emotionMap[eventSeverity] || 'idle';

        // Map severity to state
        const stateMap: Record<Severity, ClippyState> = {
          high: 'angry',
          medium: 'analyzing',
          low: 'idle',
        };

        const newState = stateMap[eventSeverity] || 'idle';

        // Handle laugh mode (INDEPENDENT from severity)
        console.log(`[Clippy] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`[Clippy] 📥 Received event:`);
        console.log(`[Clippy]    Severity: ${eventSeverity}`);
        console.log(`[Clippy]    shouldLaugh: ${data.shouldLaugh}`);
        console.log(`[Clippy]    laughReason: ${data.laughReason || 'none'}`);

        if (data.shouldLaugh) {
          setShouldPlayLaugh(true);
          console.log(`[Clippy] 😈 ACTIVATING LAUGH MODE!`);
        } else {
          setShouldPlayLaugh(false);
          console.log(`[Clippy] 🔇 No laugh mode`);
        }
        console.log(`[Clippy] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        updateState(newState, displayMessage, displayEmotion, eventSeverity);

        // Clear any existing emotion reset timer
        if (emotionResetTimer) {
          clearTimeout(emotionResetTimer);
        }

        // Set timer to reset emotion back to idle after high/medium severity
        if (eventSeverity === 'high' || eventSeverity === 'medium') {
          const timer = setTimeout(() => {
            console.log(`[Clippy] 🔄 Resetting emotion from ${displayEmotion} to idle`);
            setState('idle');
            setEmotion('idle');
            setMessage('');
          }, EMOTION_RESET_TIMEOUT);
          setEmotionResetTimer(timer);
        }
      } catch (error) {
        console.error('[Clippy] Error processing insult event:', error);
      }
    };

    window.electronAPI.onInsultEvent(handleInsultEvent);

    // Cleanup timer on unmount
    return () => {
      if (emotionResetTimer) {
        clearTimeout(emotionResetTimer);
      }
    };
  }, [enabled, updateState, emotionResetTimer]);

  const triggerManualMessage = useCallback((msg: string, emo: Emotion = 'annoyed') => {
    setMessage(msg);
    setEmotion(emo);
    setState('analyzing');
    setLastActivityTime(Date.now());
    
    // Clear any existing timer
    if (emotionResetTimer) {
      clearTimeout(emotionResetTimer);
    }
    
    // Reset after 6 seconds
    const timer = setTimeout(() => {
      setState('idle');
      setEmotion('idle');
      setMessage('');
    }, 6000);
    setEmotionResetTimer(timer);
  }, [emotionResetTimer]);

  return {
    state,
    message,
    emotion,
    severity,
    shouldPlayAlone,
    shouldPlayLaugh,
    updateState,
    triggerManualMessage,
  };
}
