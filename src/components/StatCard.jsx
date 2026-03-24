import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, bg, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, delay: delay }}
      className="glass-card p-6 border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
         <div className={`p-3 rounded-xl ${bg} ${color} transition-colors`}>
          <Icon size={24} />
        </div>
        <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
          <ChevronRight size={18} />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};

export default StatCard;
