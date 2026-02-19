import React, { useEffect, useRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';

const MagneticLink = forwardRef(({ 
  children, 
  className = '', 
  shine = false,
  to,
  href,
  external = false,
  intensity = 0.15,
  transition = 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
  disabled = false,
  ...props 
}, ref) => {
  const internalRef = useRef(null);
  const linkRef = ref || internalRef;

  useEffect(() => {
    const link = linkRef.current;
    if (!link || disabled) return;

    const handleMouseMove = (e) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      link.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
    };
    
    const handleMouseLeave = () => {
      link.style.transform = 'translate(0, 0)';
    };
    
    link.addEventListener('mousemove', handleMouseMove);
    link.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      link.removeEventListener('mousemove', handleMouseMove);
      link.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled, intensity]);

  const baseClasses = shine 
    ? 'btn-shine magnetic-btn' 
    : 'magnetic-btn';

  const linkProps = {
    ref: linkRef,
    className: `${baseClasses} ${className}`,
    style: { 
      transition,
      ...(disabled && { opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'none' })
    },
    ...props
  };

  const shineStyles = (
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
  );

  if (external) {
    return (
      <>
        {shine && shineStyles}
        <a 
          href={href || to} 
          {...linkProps} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </>
    );
  }

  return (
    <>
      {shine && shineStyles}
      <Link to={to} {...linkProps}>
        {children}
      </Link>
    </>
  );
});

MagneticLink.displayName = 'MagneticLink';

export default MagneticLink;
