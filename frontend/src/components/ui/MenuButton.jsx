import React, { useEffect, useRef, forwardRef } from 'react';
import { Link } from 'react-router-dom';

const MenuButton = forwardRef(({ 
  children, 
  variant = 'primary', // 'primary' (negro) o 'secondary' (claro)
  className = '', 
  to,
  href,
  external = false,
  intensity = 0.15,
  transition = 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
  disabled = false,
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

  // Variantes
  const variants = {
    primary: {
      base: 'bg-[#1A1A1A] text-white shadow-lg hover:bg-black hover:shadow-xl',
      hover: 'hover:bg-black hover:shadow-xl',
      active: 'active:scale-95'
    },
    secondary: {
      base: 'bg-white/10 backdrop-blur-sm border border-white/20 text-[#1A1A1A] hover:bg-white/20',
      hover: 'hover:bg-white/20',
      active: 'active:scale-95'
    }
  };

  const currentVariant = variants[variant];
  const baseClasses = `magnetic-btn hidden md:inline-flex px-5 py-2.5 rounded-full items-center gap-2 font-bold text-[14px] transition-all ${currentVariant.base} ${currentVariant.hover} ${currentVariant.active}`;

  const Component = to ? Link : 'a';
  const linkProps = to 
    ? { to, ...props }
    : { href, ...props };

  if (external && href) {
    linkProps.target = '_blank';
    linkProps.rel = 'noopener noreferrer';
  }

  return (
    <Component
      ref={buttonRef}
      className={`${baseClasses} ${className}`}
      style={{ 
        transition,
        ...(disabled && { opacity: 0.6, cursor: 'not-allowed' })
      }}
      {...linkProps}
    >
      {children}
    </Component>
  );
});

MenuButton.displayName = 'MenuButton';

export default MenuButton;
