import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-[35px] flex items-center justify-center text-rose-500 mx-auto mb-10 shadow-2xl">
          <AlertTriangle size={48} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-6xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter mb-4">404</h1>
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900 text-primary-400 rounded-full border border-slate-800 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
           <span>Vector Node Not Found</span>
        </div>
        
        <p className="text-slate-500 dark:text-slate-400 font-bold mb-12 uppercase tracking-widest text-xs opacity-60">The requested coordinate does not exist in the current ecosystem.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
           <button 
             onClick={() => navigate(-1)}
             className="flex-1 py-5 border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-black rounded-[24px] hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-all text-[11px] uppercase tracking-[0.2em] flex items-center justify-center space-x-3"
           >
             <ArrowLeft size={18} />
             <span>Go Back</span>
           </button>
           <button 
             onClick={() => navigate('/login')}
             className="flex-[1.5] py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-[24px] hover:bg-primary-600 dark:hover:bg-primary-400 shadow-2xl transition-all text-[11px] uppercase tracking-[0.4em] flex items-center justify-center space-x-3"
           >
             <Home size={18} />
             <span>Return Home</span>
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
