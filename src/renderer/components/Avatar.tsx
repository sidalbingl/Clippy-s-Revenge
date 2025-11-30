import { ClippyState } from '../hooks/useClippyState';

interface AvatarProps {
  state: ClippyState;
  enableFloating?: boolean;
}

export const Avatar = ({ state, enableFloating = true }: AvatarProps) => {
  const isAngry = state === 'angry';
  const isAnalyzing = state === 'analyzing';
  const isInactivityWarning = state === 'inactivity_warning';

  const getAnimationClass = () => {
    if (isInactivityWarning) return 'animate-bounce-subtle';
    if (isAngry) return 'animate-angry-shake'; 
    return 'animate-spooky-float';
  };

  const getPupilColor = () => {
    if (isAngry) return '#ff0000';
    if (isAnalyzing) return '#00ff00';
    return '#000000'; 
  };

  return (
    <div 
      className="relative"
      style={{ 
        pointerEvents: 'none',
        width: '176px',
        height: '208px'
      } as any}
    >
      <svg
        viewBox="0 0 200 240"
        className={getAnimationClass()}
        style={{ 
          filter: isAngry ? 'var(--angry-glow)' : 'var(--halloween-glow)',
          width: '100%',
          height: '100%',
          display: 'block',
          overflow: 'visible'
        }}
      >
        <defs>
          {/* İNCE METAL GRADIENT */}
          <linearGradient id="thinMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5a6a80" />
            <stop offset="30%" stopColor="#eef7ff" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#aabdd0" />
            <stop offset="100%" stopColor="#303040" />
          </linearGradient>

          {/* AKSESUAR RENKLERİ */}
          <linearGradient id="witchPurple" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5d2a9d" />
            <stop offset="100%" stopColor="#361266" />
          </linearGradient>
          <linearGradient id="batWing" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#2a2a2a" />
             <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          
          <radialGradient id="eye3D" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#999" />
          </radialGradient>
        </defs>

        {/* --- KATMAN 1: YARASA KANATLARI --- */}
        {/* DÜZELTME: opacity koşulu kaldırıldı, hep görünür */}
        <g transform="translate(0, 10)">
             {/* Sol Kanat */}
             <path
                d="M 45,90 Q 10,70 0,110 Q 15,130 10,150 Q 25,130 35,140 L 45,110 Z"
                fill="url(#batWing)" stroke="#000" strokeWidth="0.5"
                className="animate-pulse-slow"
             />
             {/* Sağ Kanat */}
             <path
                d="M 155,90 Q 190,70 200,110 Q 185,130 190,150 Q 175,130 165,140 L 155,110 Z"
                fill="url(#batWing)" stroke="#000" strokeWidth="0.5"
                className="animate-pulse-slow"
             />
        </g>

        {/* --- KATMAN 2: İNCE METAL GÖVDE --- */}
        <g transform="translate(0, 15)">
            <path
                d="M 100,100 L 100,150 A 20,20 0 0,1 60,150 L 60,50 A 40,40 0 0,1 140,50 L 140,150 A 50,50 0 0,1 40,150 L 40,70"
                fill="none"
                stroke="url(#thinMetal)"
                strokeWidth="12" 
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))' }}
            />
            
            {/* İnce Parlama Çizgisi */}
            <path
                d="M 100,100 L 100,150 A 20,20 0 0,1 60,150 L 60,50 A 40,40 0 0,1 140,50 L 140,150 A 50,50 0 0,1 40,150 L 40,70"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
                transform="translate(-2, -2)"
            />
        </g>

         {/* --- KATMAN 3: CADI ŞAPKASI --- */}
         {/* DÜZELTME: opacity koşulu kaldırıldı, hep görünür */}
         <g transform="translate(0, 15)">
            <g transform="translate(95, 15) rotate(-15)">
                <ellipse cx="0" cy="0" rx="35" ry="8" fill="url(#witchPurple)" stroke="#220033" strokeWidth="1"/>
                <path d="M -20,0 L -5,-50 Q 0,-60 5,-50 L 20,0 Z" fill="url(#witchPurple)" />
                <path d="M -16,-5 L -14,-15 L 14,-15 L 16,-5 Z" fill="#ff6600" />
            </g>
         </g>

        {/* --- KATMAN 4: GÖZLER --- */}
        <g transform="translate(0, 15)">
             {/* Sol Göz */}
             <g transform="translate(70, 70)">
                <ellipse cx="0" cy="0" rx="16" ry="18" fill="url(#eye3D)" stroke="#333" strokeWidth="0.5" />
                <ellipse cx="4" cy="0" rx="8" ry="10" fill={getPupilColor()} />
                <circle cx="0" cy="-5" r="3" fill="white" />
             </g>

             {/* Sağ Göz */}
             <g transform="translate(110, 70)">
                <ellipse cx="0" cy="0" rx="16" ry="18" fill="url(#eye3D)" stroke="#333" strokeWidth="0.5" />
                <ellipse cx="-4" cy="0" rx="8" ry="10" fill={getPupilColor()} />
                <circle cx="-8" cy="-5" r="3" fill="white" />
             </g>

             {/* Kaşlar */}
             <path
                d={isAngry ? "M 55,55 Q 70,65 85,60" : "M 55,50 Q 70,40 85,55"}
                stroke="black" strokeWidth="5" strokeLinecap="round" fill="none"
             />
             <path
                d={isAngry ? "M 95,60 Q 110,65 125,55" : "M 95,55 Q 110,40 125,50"}
                stroke="black" strokeWidth="5" strokeLinecap="round" fill="none"
             />
             
             {(isAngry || isAnalyzing) && (
                <g className="animate-pulse" style={{ mixBlendMode: 'color-burn' }}>
                  <ellipse cx="74" cy="70" rx="10" ry="12" fill={getPupilColor()} filter="blur(4px)" />
                  <ellipse cx="106" cy="70" rx="10" ry="12" fill={getPupilColor()} filter="blur(4px)" />
                </g>
             )}
        </g>
      </svg>
    </div>
  );
};