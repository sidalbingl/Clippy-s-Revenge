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
    return '#1a1a1a';
  };

  const getCapeGradient = () => {
    if (isAngry) return ['#8b0000', '#ff4500', '#ff6347'];
    return ['#8b2500', '#ff6600', '#ffa500'];
  };

  const [capeStart, capeMid, capeEnd] = getCapeGradient();

  return (
    <div 
      className={`relative w-40 h-40 ${getAnimationClass()}`}
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      {isAngry && (
        <div className="absolute inset-0 animate-glitch-overlay pointer-events-none z-20">
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
        viewBox="0 0 200 220"
        className={`w-full h-full ${isAngry ? 'animate-glow' : ''}`}
      >
        <defs>
          {/* Cape gradient */}
          <linearGradient id="capeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={capeStart} />
            <stop offset="50%" stopColor={capeMid} />
            <stop offset="100%" stopColor={capeEnd} />
          </linearGradient>
          
          {/* Cape glow filter */}
          <filter id="capeGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Eye shine gradient */}
          <radialGradient id="eyeShine">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Cape - behind everything */}
        <g filter="url(#capeGlow)">
          {/* Left cape fold */}
          <path
            d="M 100,60 Q 60,80 50,120 Q 45,150 40,180 Q 38,200 45,210 L 80,200 Q 85,170 90,140 Q 92,110 95,90 Z"
            fill="url(#capeGradient)"
            opacity="0.95"
          />
          
          {/* Right cape fold */}
          <path
            d="M 100,60 Q 140,80 150,120 Q 155,150 160,180 Q 162,200 155,210 L 120,200 Q 115,170 110,140 Q 108,110 105,90 Z"
            fill="url(#capeGradient)"
            opacity="0.95"
          />
          
          {/* Center cape fold - darker */}
          <path
            d="M 95,90 Q 100,110 100,140 L 100,200 L 105,90 Z"
            fill={capeStart}
            opacity="0.7"
          />
        </g>

        {/* Paperclip body */}
        <g>
          {/* Main outer loop */}
          <path
            d="M 85,50 L 85,130 Q 85,145 100,145 Q 115,145 115,130 L 115,70 Q 115,58 107,58 Q 100,58 100,70 L 100,125"
            fill="none"
            stroke="#6b7b9e"
            strokeWidth="14"
            strokeLinecap="round"
          />
          
          {/* Inner detail */}
          <path
            d="M 100,70 L 100,125 Q 100,133 104,133"
            fill="none"
            stroke="#4a5a7a"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>

        {/* Eyes - large and expressive */}
        <g>
          {/* Left eye white */}
          <ellipse
            cx="90"
            cy="75"
            rx="16"
            ry="20"
            fill="#ffffff"
          />
          
          {/* Left eye pupil */}
          <ellipse
            cx="92"
            cy="78"
            rx="8"
            ry="10"
            fill={getEyeColor()}
            className={isAngry || isAnalyzing ? 'animate-pulse' : ''}
          />
          
          {/* Left eye shine */}
          <ellipse
            cx="88"
            cy="72"
            rx="4"
            ry="5"
            fill="url(#eyeShine)"
          />

          {/* Right eye white */}
          <ellipse
            cx="110"
            cy="75"
            rx="16"
            ry="20"
            fill="#ffffff"
          />
          
          {/* Right eye pupil */}
          <ellipse
            cx="108"
            cy="78"
            rx="8"
            ry="10"
            fill={getEyeColor()}
            className={isAngry || isAnalyzing ? 'animate-pulse' : ''}
          />
          
          {/* Right eye shine */}
          <ellipse
            cx="112"
            cy="72"
            rx="4"
            ry="5"
            fill="url(#eyeShine)"
          />
        </g>

        {/* Eyebrows */}
        <g>
          <path
            d={isAngry ? "M 75,62 Q 85,58 95,60" : "M 75,60 Q 85,58 95,60"}
            stroke="#000000"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={isAngry ? "M 125,60 Q 115,58 105,62" : "M 125,60 Q 115,58 105,60"}
            stroke="#000000"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Eye glow effect for analyzing/angry */}
        {(isAngry || isAnalyzing) && (
          <g opacity="0.4" className="animate-eye-glow">
            <ellipse cx="90" cy="75" rx="20" ry="24" fill={getEyeColor()} />
            <ellipse cx="110" cy="75" rx="20" ry="24" fill={getEyeColor()} />
          </g>
        )}
      </svg>
    </div>
  );
};
