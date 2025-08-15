import React from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  React.useEffect(() => {
    if (!open) return;
    console.log('[Modal] mounted');
    return () => console.log('[Modal] unmounted');
  }, [open]);

  if (!open) return null;

  return (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        className="relative max-w-4xl w-full mx-4 mt-20"
      >
        <div className="glass rounded-3xl p-6 modal-content max-h-[80vh] overflow-auto">
          <div className="relative">
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 glass-btn text-sm rounded-full p-2 border border-white/10"
            >
              ✕
            </button>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
