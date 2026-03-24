import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable, premium ProgressBar component.
 * Features dynamic color scaling and animated reflections.
 */
const ProgressBar = ({ progress, height = 'h-2.5', showText = false }) => {
  // Logic: Map progress percentage to high-impact UI color scales.
  const getGradientScale = () => {
    if (progress === 100) return 'from-emerald-600 to-emerald-400';
    if (progress >= 50) return 'from-amber-600 to-amber-400';
    return 'from-rose-600 to-rose-400';
  };

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronized Status</span>
          <span className={`text-xs font-black font-outfit ${progress === 100 ? 'text-emerald-600' : progress >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
             {progress}%
          </span>
        </div>
      )}
      <div className={`w-full bg-slate-100 ${height} rounded-full overflow-hidden shadow-inner border border-slate-200/50 relative`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getGradientScale()} shadow-lg absolute left-0 top-0 rounded-full`}
        />
        
        {/* Visual Effect: Kinetic light sweep across the data vector. */}
        <motion.div 
           animate={{ x: ['-100%', '300%'] }}
           transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
           className="h-full w-1/4 bg-white/20 absolute skew-x-[45deg] blur-sm pointer-events-none"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
