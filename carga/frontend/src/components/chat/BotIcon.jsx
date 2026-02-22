import React from 'react';

const BotIcon = ({ size = 24, showParallax = true, whiteTheme = false }) => {
  const containerRef = React.useRef(null);
  const pupilLRef = React.useRef(null);
  const pupilRRef = React.useRef(null);
  const svgRef = React.useRef(null);
  const id = React.useId().replace(/:/g, '');

  React.useEffect(() => {
    const pupilL = pupilLRef.current;
    const pupilR = pupilRRef.current;
    const svg = svgRef.current;
    const container = containerRef.current;

    const handleMouseMove = (e) => {
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      if (!rect || rect.width === 0) return;

      const svgCenterX = rect.left + rect.width / 2;
      const svgCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - svgCenterX;
      const deltaY = e.clientY - svgCenterY;

      if (showParallax && container) {
        let rotateY = (deltaX / window.innerWidth) * 40;
        let rotateX = (deltaY / window.innerHeight) * -40;
        rotateY = Math.max(-20, Math.min(20, rotateY));
        rotateX = Math.max(-20, Math.min(20, rotateX));
        container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / (showParallax ? 120 : 160), 1);

      const moveX = Math.cos(angle) * (showParallax ? 0.5 : 0.4) * distance;
      const moveY = Math.sin(angle) * 2.2 * distance;

      if (pupilL) pupilL.style.transform = `translate(${moveX}px, ${moveY}px)`;
      if (pupilR) pupilR.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    const handleMouseLeave = () => {
      if (container && showParallax) container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (pupilL) pupilL.style.transform = 'translate(0px, 0px)';
      if (pupilR) pupilR.style.transform = 'translate(0px, 0px)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showParallax]);

  const bodyFill = whiteTheme ? `url(#grad-white-${id})` : `url(#grad-${id})`;
  const eyeStroke = whiteTheme ? '#000000' : '#FFFFFF';
  const pupilFill = whiteTheme ? '#000000' : '#FFFFFF';

  return (
    <div className={`bot-icon-wrapper ${showParallax ? 'floating' : ''}`} style={{ width: size, height: size, position: 'relative' }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.1s linear' }}
      >
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <defs>
            {whiteTheme ? (
              <linearGradient id={`grad-white-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#A0A0A0', stopOpacity: 1 }} />
              </linearGradient>
            ) : (
              <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#2D2D33', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#141416', stopOpacity: 1 }} />
              </linearGradient>
            )}
            <clipPath id={`leftEyeClip-${id}`}>
              <rect x="6.5" y="8" width="3" height="8" rx="1.5">
                <animate attributeName="height" values="8; 0; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
                <animate attributeName="y" values="8; 12; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
                <animate attributeName="rx" values="1.5; 0; 1.5; 1.5" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
              </rect>
            </clipPath>
            <clipPath id={`rightEyeClip-${id}`}>
              <rect x="14.5" y="8" width="3" height="8" rx="1.5">
                <animate attributeName="height" values="8; 0; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
                <animate attributeName="y" values="8; 12; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
                <animate attributeName="rx" values="1.5; 0; 1.5; 1.5" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
              </rect>
            </clipPath>
          </defs>
          <path d="M0 11 Q0 0 11 0 L24 0 L24 13 Q24 24 13 24 L0 24 Z" fill={bodyFill} />
          <g clipPath={`url(#leftEyeClip-${id})`}>
            <circle ref={pupilLRef} cx="8" cy="12" r={showParallax ? 1.1 : 0.9} fill={pupilFill} style={{ transition: 'transform 0.05s linear' }} />
          </g>
          <g clipPath={`url(#rightEyeClip-${id})`}>
            <circle ref={pupilRRef} cx="16" cy="12" r={showParallax ? 1.1 : 0.9} fill={pupilFill} style={{ transition: 'transform 0.05s linear' }} />
          </g>
          <rect x="6.5" y="8" width="3" height="8" rx="1.5" fill="none" stroke={eyeStroke} strokeWidth="0.75">
            <animate attributeName="height" values="8; 0; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="8; 12; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="rx" values="1.5; 0; 1.5; 1.5" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="14.5" y="8" width="3" height="8" rx="1.5" fill="none" stroke={eyeStroke} strokeWidth="0.75">
            <animate attributeName="height" values="8; 0; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="8; 12; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="rx" values="1.5; 0; 1.5; 1.5" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>
    </div>
  );
};

export const PremiumBotIcon = () => (
  <BotIcon size={42} showParallax={false} whiteTheme={true} />
);

export const PremiumBotIconStatic = () => (
  <BotIcon size={24} showParallax={false} whiteTheme={false} />
);

export default BotIcon;
