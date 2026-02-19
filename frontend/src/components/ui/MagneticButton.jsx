import React, { useEffect, useRef, forwardRef } from 'react';

const MagneticButton = forwardRef(({ 
  children, 
  className = '', 
  shine = false,
  onClick,
  type = 'button',
  disabled = false,
  intensity = 0.15,
  transition = 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
  ...props 
}, ref) => {
  const internalRef = useRef(null);
  const buttonRef = ref || internalRef;

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || disabled) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
    };
    
    const handleMouseLeave = () => {
      button.style.transform = 'translate(0, 0)';
    };
    
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled, intensity]);

  const baseClasses = shine 
    ? 'btn-shine magnetic-btn' 
    : 'magnetic-btn';

  return (
    <>
      {shine && (
        <style jsx>{`
          .btn-shine {
            position: relative;
            overflow: hidden;
          }
          
          .btn-shine::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
            transition: none;
          }
          
          .btn-shine:hover::after {
            animation: btnSweep 0.6s ease forwards;
          }
          
          @keyframes btnSweep {
            to {
              left: 150%;
            }
          }
        `}</style>
      )}
      
      <button
        ref={buttonRef}
        type={type}
        className={`${baseClasses} ${className}`}
        onClick={onClick}
        disabled={disabled}
        style={{ 
          transition,
          ...(disabled && { opacity: 0.6, cursor: 'not-allowed' })
        }}
        {...props}
      >
        {children}
      </button>
    </>
  );
});

MagneticButton.displayName = 'MagneticButton';

export default MagneticButton;
