import { useState, useEffect } from 'react';

export type Emotion = 'idle' | 'annoyed' | 'furious';

interface SpeechBubbleProps {
  message: string;
  emotion?: Emotion;
  isVisible?: boolean;
}

const EMOTION_STYLES = {
  idle: {
    borderColor: 'border-evil-grey',
    textColor: 'text-gray-300',
    pointerColor: '#666666',
  },
  annoyed: {
    borderColor: 'border-orange-700',
    textColor: 'text-orange-200',
    pointerColor: '#ff6600',
  },
  furious: {
    borderColor: 'border-evil-red-dark',
    textColor: 'text-red-200',
    pointerColor: '#ff0000',
  },
};

export const SpeechBubble = ({ 
  message, 
  emotion = 'idle',
  isVisible = true 
}: SpeechBubbleProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const styles = EMOTION_STYLES[emotion];

  useEffect(() => {
    if (message && isVisible) {
      setShowBubble(true);
      setDisplayedText('');
      setIsTyping(true);
      let index = 0;
      
      const typingSpeed = emotion === 'furious' ? 20 : emotion === 'annoyed' ? 25 : 30;
      
      const interval = setInterval(() => {
        if (index < message.length) {
          setDisplayedText(message.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, typingSpeed);

      return () => {
        clearInterval(interval);
        setIsTyping(false);
      };
    } else if (!isVisible) {
      setShowBubble(false);
    }
  }, [message, isVisible, emotion]);

  if (!showBubble || !message) return null;

  return (
    <div className="relative mb-6 animate-fade-in max-w-xs min-w-[200px]">
      {/* Win95 Dark style speech bubble with emotion-based styling */}
      <div 
        className={`
          win95-bubble border-2 ${styles.borderColor}
          p-4 relative transition-all duration-300
          ${emotion === 'furious' ? 'animate-pulse' : ''}
        `}
        style={{
          filter: `drop-shadow(0 0 ${emotion === 'furious' ? '16px' : emotion === 'annoyed' ? '12px' : '8px'} ${styles.pointerColor}40)`,
        }}
      >
        {/* Retro pixel grid overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 1px, ${styles.pointerColor} 1px, ${styles.pointerColor} 2px),
              repeating-linear-gradient(90deg, transparent, transparent 1px, ${styles.pointerColor} 1px, ${styles.pointerColor} 2px)
            `,
            backgroundSize: '4px 4px',
          }}
        />
        
        {/* Message text with CRT glow */}
        <p className={`${styles.textColor} crt-text-glow text-sm font-mono leading-relaxed whitespace-pre-wrap break-words relative z-10`}>
          {displayedText}
          {isTyping && (
            <span 
              className="animate-blink crt-text-glow"
              style={{ color: styles.pointerColor }}
            >
              ▌
            </span>
          )}
        </p>

        {/* Furious state: additional red glow overlay */}
        {emotion === 'furious' && (
          <div className="absolute inset-0 pointer-events-none bg-evil-red opacity-5 animate-pulse" />
        )}
      </div>

      {/* Speech bubble pointer with pixel-perfect styling */}
      <div className="absolute -bottom-3 left-10">
        <div 
          className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-transparent"
          style={{ 
            borderTopColor: styles.pointerColor,
            filter: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))`,
          }}
        />
        <div 
          className="absolute top-[-1px] left-[-10px] w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-transparent"
          style={{ borderTopColor: 'var(--evil-black)' }}
        />
      </div>
    </div>
  );
};
