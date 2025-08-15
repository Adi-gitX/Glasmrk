import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -6, scale: 1.03 } : undefined}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className={`glass rounded-3xl transition-all duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
};