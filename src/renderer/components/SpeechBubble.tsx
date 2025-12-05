import { useState, useEffect } from 'react';

export type Emotion = 'idle' | 'annoyed' | 'furious';

interface SpeechBubbleProps {
  message: string;
  emotion?: Emotion;
  isVisible?: boolean;
  onTypingComplete?: () => void;
}

const EMOTION_STYLES = {
  idle: {
    bg: 'rgba(42, 42, 42, 0.95)',
    border: '#666666',
    text: '#e0e0e0',
    glow: 'rgba(147, 51, 234, 0.4)',
  },
  annoyed: {
    bg: 'rgba(139, 37, 0, 0.95)',
    border: '#ff6600',
    text: '#ffe0cc',
    glow: 'rgba(255, 102, 0, 0.6)',
  },
  furious: {
    bg: 'rgba(139, 0, 0, 0.95)',
    border: '#ff0000',
    text: '#ffcccc',
    glow: 'rgba(255, 0, 0, 0.8)',
  },
};

export const SpeechBubble = ({ 
  message, 
  emotion = 'idle',
  isVisible = true,
  onTypingComplete
}: SpeechBubbleProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const styles = EMOTION_STYLES[emotion];

  useEffect(() => {
    if (message && isVisible) {
      setShowBubble(true);
      setDisplayedText('');
      setIsTyping(true);
      setIsFadingOut(false);
      let index = 0;
      
      const typingSpeed = emotion === 'furious' ? 15 : emotion === 'annoyed' ? 20 : 25;
      
      const typingInterval = setInterval(() => {
        if (index < message.length) {
          setDisplayedText(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          // Notify parent that typing is complete
          if (onTypingComplete) {
            onTypingComplete();
          }
        }
      }, typingSpeed);

      const displayDuration = emotion === 'furious' ? 20000 : emotion === 'annoyed' ? 20000 : 20000; // 20 seconds for screenshots
      
      const hideTimeout = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setShowBubble(false);
          setDisplayedText('');
        }, 500);
      }, displayDuration);

      return () => {
        clearInterval(typingInterval);
        clearTimeout(hideTimeout);
        setIsTyping(false);
      };
    } else if (!isVisible) {
      setShowBubble(false);
    }
  }, [message, isVisible, emotion]);

  if (!showBubble || !message) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        maxWidth: '280px',
        minWidth: '180px',
        animation: isFadingOut ? 'fadeOut 0.5s ease-out' : 'fadeIn 0.3s ease-out',
        opacity: isFadingOut ? 0 : 1
      }}
    >
      {/* Modern Halloween-themed bubble */}
      <div 
        style={{
          background: styles.bg,
          border: `2px solid ${styles.border}`,
          borderRadius: '16px',
          padding: '12px 16px',
          position: 'relative',
          backdropFilter: 'blur(10px)',
          boxShadow: `
            0 0 20px ${styles.glow},
            0 4px 12px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          animation: emotion === 'furious' ? 'pulse 0.8s ease-in-out infinite' : 'none'
        }}
      >
        {/* Message text */}
        <p 
          style={{
            color: styles.text,
            fontSize: '13px',
            fontFamily: 'monospace',
            lineHeight: '1.5',
            margin: 0,
            textShadow: `0 0 8px ${styles.glow}`,
            wordBreak: 'break-word'
          }}
        >
          {displayedText}
          {isTyping && (
            <span 
              style={{
                color: styles.border,
                animation: 'blink 1s step-end infinite',
                textShadow: `0 0 8px ${styles.glow}`
              }}
            >
              ▌
            </span>
          )}
        </p>
      </div>

      {/* Pointer tail - pointing left to avatar */}
      <svg
        width="12"
        height="20"
        viewBox="0 0 12 20"
        style={{
          position: 'absolute',
          left: '-10px',
          top: '50%',
          transform: 'translateY(-50%)',
          filter: `drop-shadow(-2px 0 4px rgba(0, 0, 0, 0.6))`
        }}
      >
        <path
          d="M 0,10 L 12,0 L 12,20 Z"
          fill={styles.bg}
          stroke={styles.border}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
