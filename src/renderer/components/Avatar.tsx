import { ClippyState } from '../hooks/useClippyState';

interface AvatarProps {
  state: ClippyState;
}

export const Avatar = ({ state }: AvatarProps) => {
  const isAngry = state === 'angry';
  const isAnalyzing = state === 'analyzing';
  const isInactivityWarning = state === 'inactivity_warning';
  
  const getAnimationClass = () => {
    if (isInactivityWarning) return 'animate-bounce-subtle';
    return 'animate-idle-float';
  };

  const getEyeColor = () => {
    if (isAngry) return '#ff0000';
    if (isAnalyzing) return '#ff6600';
    if (isInactivityWarning) return '#ffaa00';
    return '#ffffff';
  };

  return (
    <div 
      className={`relative w-40 h-40 ${getAnimationClass()}`}
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      {/* Glitch overlay for angry state */}
      {isAngry && (
        <div className="absolute inset-0 animate-glitch-overlay pointer-events-none">
          <svg className="w-full h-full">
            <filter id="glitch">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#glitch)" opacity="0.15" />
          </svg>
        </div>
      )}

      <svg
        viewBox="0 0 120 140"
        className={`w-full h-full ${isAngry ? 'animate-glow' : ''}`}
      >
        {/* Clippy body - paperclip shape */}
        <path
          d="M40,20 L40,100 Q40,120 60,120 Q80,120 80,100 L80,40 Q80,25 70,25 Q60,25 60,40 L60,95"
          fill="none"
          stroke={isAngry ? '#8b0000' : '#2a2a2a'}
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Inner curve detail */}
        <path
          d="M60,40 L60,95 Q60,105 65,105"
          fill="none"
          stroke={isAngry ? '#660000' : '#1a1a1a'}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Face background */}
        <ellipse
          cx="60"
          cy="60"
          rx="25"
          ry="30"
          fill="#1a1a1a"
          opacity="0.8"
        />
        
        {/* Eyes */}
        <circle
          cx="52"
          cy="55"
          r="4"
          fill={getEyeColor()}
          className={isAngry || isAnalyzing ? 'animate-pulse' : ''}
        >
          {isAngry && (
            <animate
              attributeName="r"
              values="4;5;4"
              dur="0.3s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle
          cx="68"
          cy="55"
          r="4"
          fill={getEyeColor()}
          className={isAngry || isAnalyzing ? 'animate-pulse' : ''}
        >
          {isAngry && (
            <animate
              attributeName="r"
              values="4;5;4"
              dur="0.3s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Eye glow effect */}
        {(isAngry || isAnalyzing) && (
          <>
            <circle cx="52" cy="55" r="8" fill={getEyeColor()} opacity="0.3" className="animate-eye-glow" />
            <circle cx="68" cy="55" r="8" fill={getEyeColor()} opacity="0.3" className="animate-eye-glow" />
          </>
        )}
        
        {/* Mouth - changes based on state */}
        <path
          d={
            isAngry 
              ? 'M48,70 Q60,62 72,70' 
              : isInactivityWarning
              ? 'M48,68 L72,68'
              : 'M48,68 Q60,75 72,68'
          }
          stroke={isAngry ? '#ff0000' : '#666'}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Angry eyebrows */}
        {isAngry && (
          <>
            <path d="M45,48 L55,52" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" />
            <path d="M75,48 L65,52" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};
