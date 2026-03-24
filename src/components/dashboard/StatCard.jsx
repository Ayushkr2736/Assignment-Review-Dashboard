import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable StatCard component for Dashboard totals.
 */
const StatCard = ({ 
  label, 
  value, 
  status, 
  icon: Icon, 
  colorClasses, 
  bgClasses, 
  delay = 0 
}) => {
  return (
    <motion.div 
       initial={{ opacity: 0, scale: 0.9 }} 
       animate={{ opacity: 1, scale: 1 }} 
       transition={{ duration: 0.6, delay }}
       className="p-8 bg-white border border-slate-200 rounded-[40px] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-primary-100 transition-all duration-500 group relative overflow-hidden"
    >
      <div className="flex items-center space-x-5 mb-6 relative z-10">
         <div className={`p-4 rounded-[22px] ${bgClasses} ${colorClasses} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
           <Icon size={26} strokeWidth={2.5} />
         </div>
         <div>
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 leading-none">{label}</div>
           <div className="text-3xl font-black text-slate-900 font-outfit leading-none">{value}</div>
         </div>
      </div>
      <div className={`text-[10px] font-black uppercase tracking-[0.2em] relative z-10 ${status?.includes('+') ? 'text-emerald-600' : 'text-slate-500 opacity-60'}`}>
        {status}
      </div>
      
      {/* Background Icon Watermark */}
      <div className={`absolute -bottom-10 -right-10 ${colorClasses} opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`}>
         <Icon size={120} strokeWidth={1} />
      </div>
    </motion.div>
  );
};

export default StatCard;
