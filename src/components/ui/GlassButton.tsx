import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}
export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>((props, ref) => {
  const { children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' } = props;
  const variants = {
    primary: 'bg-blue-500/15 border-blue-400/20 text-blue-100 hover:bg-blue-500/25 hover:border-blue-400/40',
    secondary: 'bg-white/5 border-white/15 text-white hover:bg-white/15 hover:border-white/25',
    danger: 'bg-red-500/15 border-red-400/20 text-red-100 hover:bg-red-500/25 hover:border-red-400/40'
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`glass-btn
        rounded-2xl px-6 py-3
        font-medium transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg hover:shadow-xl
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </motion.button>
  );
});

GlassButton.displayName = 'GlassButton';