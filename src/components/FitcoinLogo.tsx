import React from 'react';

interface FitcoinLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showGlow?: boolean;
}

export const FitcoinLogo: React.FC<FitcoinLogoProps> = ({ 
  className = '', 
  size = 'md',
  showGlow = true
}) => {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
    '3xl': 'w-24 h-24'
  };

  const dimensionClass = sizeMap[size] || 'w-8 h-8';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 rounded-full aspect-square ${dimensionClass} ${className}`}>
      {showGlow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/40 via-amber-500/30 to-emerald-500/40 blur-sm animate-pulse" />
      )}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]"
      >
        <defs>
          {/* Metallic Outer Ring Gradients */}
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="goldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Left Red Face Gradient */}
          <linearGradient id="leftRedFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="50%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>

          {/* Right Green Face Gradient */}
          <linearGradient id="rightGreenFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          {/* Yoga Figure Gold Glow */}
          <linearGradient id="figureGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Metallic Ring */}
        <circle cx="100" cy="100" r="96" fill="url(#ringGrad)" stroke="url(#goldBorder)" strokeWidth="4" />
        
        {/* Inner Bezel Ring */}
        <circle cx="100" cy="100" r="85" fill="#0f172a" stroke="url(#goldBorder)" strokeWidth="3" />

        {/* Split Left (Red) & Right (Green) Face using ClipPath or Semicircles */}
        <g>
          {/* Left Red Semicircle */}
          <path d="M 100 18 A 82 82 0 0 0 100 182 Z" fill="url(#leftRedFace)" />
          
          {/* Right Green Semicircle */}
          <path d="M 100 18 A 82 82 0 0 1 100 182 Z" fill="url(#rightGreenFace)" />
          
          {/* Subtle Yin-Yang Curve Seam */}
          <path
            d="M 100 18 C 120 60, 80 140, 100 182"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
        </g>

        {/* Studs / Rivets around outer rim */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 90.5 * Math.cos(rad);
          const cy = 100 + 90.5 * Math.sin(rad);
          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r="3.5"
              fill="#fef08a"
              stroke="#78350f"
              strokeWidth="1"
            />
          );
        })}

        {/* Halo Glow behind head */}
        <circle cx="100" cy="72" r="28" fill="url(#haloGlow)" />
        <circle
          cx="100"
          cy="72"
          r="22"
          fill="none"
          stroke="url(#figureGold)"
          strokeWidth="2"
          strokeDasharray="2 3"
        />

        {/* Golden Yoga Silhouette in Lotus Position */}
        <g stroke="url(#figureGold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Head & Crown */}
          <circle cx="100" cy="72" r="8" fill="url(#figureGold)" />

          {/* Prayer Hands (Namaste Pose above chest) */}
          <path d="M 100 84 L 100 96" />
          <path d="M 97 89 L 100 84 L 103 89" fill="url(#figureGold)" />

          {/* Torso & Spine */}
          <path d="M 100 96 L 100 125" />

          {/* Shoulders & Arms in Prayer */}
          <path d="M 82 100 L 96 95 L 100 88" />
          <path d="M 118 100 L 104 95 L 100 88" />

          {/* Lotus Legs Base */}
          <path d="M 100 125 L 75 132 C 70 134, 75 142, 85 142 L 115 142 C 125 142, 130 134, 125 132 Z" />
          <path d="M 75 132 L 100 120 L 125 132" />
        </g>

        {/* EMBOSSED FITCOIN TEXT */}
        <text
          x="100"
          y="162"
          textAnchor="middle"
          fill="url(#figureGold)"
          fontSize="16"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2.5"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
        >
          FITCOIN
        </text>
      </svg>
    </div>
  );
};
