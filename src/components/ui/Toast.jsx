import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    info: <Info className="text-primary-500" size={20} />,
    error: <AlertTriangle className="text-rose-500" size={20} />
  };

  const colors = {
    success: 'border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/20',
    info: 'border-primary-100 dark:border-primary-900/50 bg-primary-50/80 dark:bg-primary-950/20',
    error: 'border-rose-100 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/20'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`fixed bottom-10 right-10 z-[300] flex items-center space-x-4 p-5 rounded-[24px] border backdrop-blur-xl shadow-2xl min-w-[320px] ${colors[type]}`}
        >
          <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
            {icons[type]}
          </div>
          <div className="flex-grow">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1 leading-none">{type === 'success' ? 'Synchronized' : 'Information'}</div>
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{message}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-slate-400">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
