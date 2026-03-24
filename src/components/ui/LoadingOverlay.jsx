import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ShieldCheck } from 'lucide-react';

/**
 * Global Lifecycle Syncing Overlay.
 * Maintains brand presence during high-intensity data hydration.
 */
const LoadingOverlay = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/90 backdrop-blur-2xl"
    >
      <motion.div 
         animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0], y: [0, -10, 0] }}
         transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
         className="w-24 h-24 bg-slate-900 rounded-[35px] flex items-center justify-center text-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] mb-10 overflow-hidden group"
      >
         <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-indigo-600 opacity-60 group-hover:opacity-100" />
         <GraduationCap size={44} strokeWidth={2.5} className="relative z-10" />
      </motion.div>
      
      <div className="flex items-center space-x-3">
         {[0, 0.2, 0.4].map((delay, i) => (
           <motion.div 
             key={i}
             animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
             transition={{ duration: 2, repeat: Infinity, delay }}
             className="w-3 h-3 rounded-full bg-primary-600/40"
           />
         ))}
      </div>
      
      <p className="mt-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] animate-pulse">Establishing Nexus Connection</p>
    </motion.div>
  );
};

export default LoadingOverlay;
