import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Send, Sparkles, FileCheck, ShieldCheck } from 'lucide-react';

/**
 * Verified Submission Modal for Students.
 * High-impact design with dark mode and verification workflow.
 */
const SubmissionModal = ({ isOpen, onClose, onConfirm, assignmentTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-3xl"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[60px] shadow-[0_120px_180px_rgba(0,0,0,0.3)] dark:shadow-none overflow-hidden border-8 border-white dark:border-slate-800 p-12 lg:p-20 text-center"
          >
            <div className="mx-auto w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-[35px] flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-10 shadow-xl shadow-emerald-500/10 group active:animate-ping transition-all">
               <FileCheck size={44} strokeWidth={2.5} className="group-hover:scale-125 transition-transform duration-500" />
            </div>

            <div className="space-y-6 mb-12">
               <div>
                  <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter leading-none mb-6">Confirm Transmit</h3>
                  <div className="inline-flex items-center space-x-2 px-5 py-2 bg-slate-900 dark:bg-black text-emerald-400 rounded-full border border-slate-800 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg">
                     <ShieldCheck size={16} />
                     <span>Verified Deployment Protocol</span>
                  </div>
               </div>
               
               <p className="text-slate-500 dark:text-slate-400 font-bold text-lg px-4 leading-relaxed lg:px-6 italic border-x-4 border-slate-100 dark:border-slate-800 italic opacity-80 decoration-slate-200 dark:decoration-slate-700 underline underline-offset-8">
                 Are you prepared to finalize your evaluation for <span className="text-slate-900 dark:text-white not-italic uppercase font-black tracking-tight">{assignmentTitle}</span>? 
               </p>

               <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] opacity-60">This action will synchronize your work with the master repository.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
               <button 
                 onClick={onClose}
                 className="w-full sm:flex-1 py-6 border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-black rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white hover:text-slate-900 transition-all text-[11px] uppercase tracking-[0.3em]"
               >
                 Cancel Sync
               </button>
               <button 
                 onClick={onConfirm}
                 className="w-full sm:flex-[1.5] py-6 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-full hover:bg-emerald-600 shadow-2xl hover:shadow-emerald-500/30 active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em] flex items-center justify-center space-x-4 relative overflow-hidden group"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 <span className="relative z-10">Broadcast Packets</span>
                 <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubmissionModal;
