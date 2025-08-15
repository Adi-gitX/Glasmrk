import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 1000);
    const timer2 = setTimeout(() => setPhase(2), 2000);
    const timer3 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: phase >= 1 ? 1.2 : 0.8,
            opacity: phase === 0 ? 1 : phase === 1 ? 0.3 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center mb-6"
        >
          <FileText className="h-16 w-16 text-blue-400" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: phase >= 1 ? (phase === 2 ? 0 : 1) : 0,
            y: phase >= 1 ? 0 : 20 
          }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl font-bold text-white"
        >
          Glasmrk
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: phase >= 1 ? (phase === 2 ? 0 : 0.7) : 0,
            y: phase >= 1 ? 0 : 20 
          }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-gray-400 mt-2"
        >
          Beautiful Markdown Sharing
        </motion.p>
      </div>
    </motion.div>
  );
};