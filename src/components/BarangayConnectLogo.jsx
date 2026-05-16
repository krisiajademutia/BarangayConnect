import React from 'react';

const BarangayConnectLogo = ({ 
  size = 40, 
  animate = true, 
  showText = true, 
  layout = 'horizontal', // 'horizontal' or 'vertical'
  textSize = 'normal' // 'small', 'normal', 'large'
}) => {
  const logoId = `logo-${Math.random().toString(36).substr(2, 9)}`;
  
  const getTextStyle = () => {
    const baseSize = textSize === 'large' ? '2rem' : textSize === 'small' ? '0.9rem' : '1.2rem';
    return {
      fontFamily: 'Inter, sans-serif', 
      fontWeight: '800',
      fontSize: baseSize,
      letterSpacing: '-0.02em',
      textAlign: layout === 'vertical' ? 'center' : 'left'
    };
  };

  const LogoSVG = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      style={{ 
        transform: animate ? 'translateZ(0)' : 'none',
      }}
    >
      <defs>
        <linearGradient id={`${logoId}-shield`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="#2F679B" />
        </linearGradient>
        <linearGradient id={`${logoId}-danger`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4757" />
          <stop offset="100%" stopColor="#D33033" />
        </linearGradient>
      </defs>
      
      {/* Animated signal waves */}
      <g>
        {/* Outer blue wave */}
        <path
          d="M 20 25 A 30 30 0 0 1 80 25"
          fill="none"
          stroke="#4A90E2"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={animate ? "0.8" : "1"}
        >
          {animate && (
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </path>
        
        {/* Middle blue wave */}
        <path
          d="M 25 30 A 25 25 0 0 1 75 30"
          fill="none"
          stroke="#4A90E2"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={animate ? "0.6" : "1"}
        >
          {animate && (
            <animate
              attributeName="opacity"
              values="0.2;0.6;0.2"
              dur="2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          )}
        </path>
        
        {/* Inner red wave */}
        <path
          d="M 35 35 A 15 15 0 0 1 65 35"
          fill="none"
          stroke={`url(#${logoId}-danger)`}
          strokeWidth="3"
          strokeLinecap="round"
          opacity={animate ? "0.9" : "1"}
        >
          {animate && (
            <animate
              attributeName="opacity"
              values="0.4;0.9;0.4"
              dur="2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          )}
        </path>
        
        {/* Center red wave */}
        <path
          d="M 40 40 A 10 10 0 0 1 60 40"
          fill="none"
          stroke={`url(#${logoId}-danger)`}
          strokeWidth="2"
          strokeLinecap="round"
          opacity={animate ? "1" : "1"}
        >
          {animate && (
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              begin="0.9s"
              repeatCount="indefinite"
            />
          )}
        </path>
      </g>
      
      {/* Shield body */}
      <path
        d="M 50 45 L 25 50 Q 25 75 50 85 Q 75 75 75 50 L 50 45 Z"
        fill={`url(#${logoId}-shield)`}
        stroke="#2F679B"
        strokeWidth="2"
        opacity="0.9"
      >
        {animate && (
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.05;1"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </path>
      
      {/* Location pin */}
      <circle
        cx="50"
        cy="55"
        r="6"
        fill="#2F679B"
        stroke="white"
        strokeWidth="2"
      >
        {animate && (
          <animate
            attributeName="r"
            values="6;7;6"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      
      {/* Connection symbol (infinity-like) */}
      <path
        d="M 42 65 Q 46 62 50 65 Q 54 68 58 65 Q 54 62 50 65 Q 46 68 42 65"
        fill="none"
        stroke="#2F679B"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      >
        {animate && (
          <animate
            attributeName="opacity"
            values="0.5;0.8;0.5"
            dur="2.5s"
            repeatCount="indefinite"
          />
        )}
      </path>
      
      {/* Pulse effect for emergency mode */}
      {animate && (
        <circle
          cx="50"
          cy="55"
          r="8"
          fill="none"
          stroke="#FF4757"
          strokeWidth="1"
          opacity="0"
        >
          <animate
            attributeName="r"
            values="8;20;8"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );

  if (layout === 'vertical') {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: showText ? '12px' : '0',
        filter: 'drop-shadow(0 4px 8px rgba(47, 103, 155, 0.2))'
      }}>
        <LogoSVG />
        {showText && (
          <div style={getTextStyle()}>
            <div style={{ color: 'var(--barangay-blue)', marginBottom: '2px' }}>Barangay</div>
            <div style={{ color: 'var(--connect-red)' }}>Connect</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: showText ? '12px' : '0',
      filter: 'drop-shadow(0 4px 8px rgba(47, 103, 155, 0.2))'
    }}>
      <LogoSVG />
      {showText && (
        <div style={getTextStyle()}>
          <span style={{ color: 'var(--barangay-blue)' }}>Barangay</span>
          <span style={{ color: 'var(--connect-red)' }}>Connect</span>
        </div>
      )}
    </div>
  );
};

export default BarangayConnectLogo;