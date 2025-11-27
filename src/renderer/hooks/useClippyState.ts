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

const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes for "where are you" sound
const LONG_INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes for messages
const INACTIVITY_MESSAGES = [
  "Still there? Should I call an ambulance for your productivity?",
  "I've seen glaciers move faster than your coding.",
  "Taking a nap? Don't worry, your bugs will wait.",
  "Is this a coffee break or a career break?",
];

export function useClippyState() {
  const [state, setState] = useState<ClippyState>('idle');
  const [message, setMessage] = useState<string>('');
  const [emotion, setEmotion] = useState<Emotion>('idle');
  const [severity, setSeverity] = useState<Severity>('low');
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [shouldPlayAlone, setShouldPlayAlone] = useState(false);
  const [shouldPlayLaugh, setShouldPlayLaugh] = useState(false);

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
    const checkInactivity = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityTime;
      
      // Stage 1: Play "where are you" sound after 2 minutes
      if (timeSinceActivity >= INACTIVITY_TIMEOUT && timeSinceActivity < LONG_INACTIVITY_TIMEOUT) {
        if (!shouldPlayAlone) {
          setShouldPlayAlone(true);
          console.log('[Clippy] User inactive for 2 minutes - playing alone sound');
        }
      }
      
      // Stage 2: Show message and change state after 5 minutes
      if (timeSinceActivity >= LONG_INACTIVITY_TIMEOUT && state !== 'inactivity_warning') {
        const randomMessage = INACTIVITY_MESSAGES[Math.floor(Math.random() * INACTIVITY_MESSAGES.length)];
        updateState('inactivity_warning', randomMessage, 'annoyed', 'medium');
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInactivity);
  }, [lastActivityTime, state, shouldPlayAlone, updateState]);

  // Listen for insult events from MCP
  useEffect(() => {
    if (!window.electronAPI) {
      console.warn('[Clippy] electronAPI not available');
      return;
    }

    const handleInsultEvent = (data: InsultEvent) => {
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
      } catch (error) {
        console.error('[Clippy] Error processing insult event:', error);
      }
    };

    window.electronAPI.onInsultEvent(handleInsultEvent);
  }, [updateState]);

  return { 
    state, 
    message,
    emotion,
    severity,
    shouldPlayAlone,
    shouldPlayLaugh,
    updateState,
  };
}
