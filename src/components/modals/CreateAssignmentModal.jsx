import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Link as LinkIcon, FileText, Send, Sparkles } from 'lucide-react';

/**
 * Modal for Admins to create and distribute new assignments.
 * Modern SaaS design with dark mode support.
 */
const CreateAssignmentModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    driveLink: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      setFormData({ title: '', description: '', dueDate: '', driveLink: '' });
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-xl"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[50px] shadow-[0_100px_150px_rgba(0,0,0,0.2)] dark:shadow-none overflow-hidden border-8 border-white dark:border-slate-800"
          >
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/10 backdrop-blur-md">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-slate-900 dark:bg-white rounded-[22px] flex items-center justify-center text-white dark:text-slate-900 shadow-2xl relative overflow-hidden group">
                   <Plus size={30} strokeWidth={2.5} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-400 opacity-0 group-hover:opacity-10 dark:opacity-0 transition-opacity" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter">Forge Evaluation</h3>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] mt-1 italic">Initiate curriculum distribution</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-4 text-slate-300 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-3xl active:scale-90"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 lg:p-14 space-y-10">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] ml-2">Evaluation Title</label>
                 <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 dark:text-slate-700 group-focus-within:text-primary-600 transition-colors">
                       <FileText size={22} strokeWidth={2.5} />
                    </div>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. ADVANCED CONSTRUCT SYSTEM DESIGN"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-100 dark:focus:border-primary-900/50 focus:bg-white dark:focus:bg-slate-950 focus:ring-[12px] focus:ring-primary-50 dark:focus:ring-primary-400/10 rounded-[28px] text-sm font-bold tracking-tight transition-all placeholder:text-slate-300 dark:text-slate-700 dark:text-white uppercase" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] ml-2">Objective Summary</label>
                 <textarea 
                   required
                   rows="3"
                   placeholder="Describe the learning outcomes and technical requirements..."
                   className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-100 dark:focus:border-primary-900/50 focus:bg-white dark:focus:bg-slate-950 focus:ring-[12px] focus:ring-primary-50 dark:focus:ring-primary-400/10 rounded-[35px] text-sm font-bold tracking-tight transition-all placeholder:text-slate-300 dark:text-slate-700 dark:text-white min-h-[140px] resize-none italic" 
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] ml-2">Execution Deadline</label>
                    <div className="relative group">
                       <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 dark:text-slate-700 group-focus-within:text-primary-600 transition-colors">
                          <Calendar size={22} strokeWidth={2.5} />
                       </div>
                       <input 
                         type="date" 
                         required
                         className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-100 dark:focus:border-primary-900/50 focus:bg-white dark:focus:bg-slate-950 focus:ring-[12px] focus:ring-primary-50 dark:focus:ring-primary-400/10 rounded-[28px] text-sm font-bold tracking-tight transition-all appearance-none dark:text-white dark:inv-date" 
                         value={formData.dueDate}
                         onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] ml-2">Resource Node</label>
                    <div className="relative group">
                       <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 dark:text-slate-700 group-focus-within:text-primary-600 transition-colors">
                          <LinkIcon size={22} strokeWidth={2.5} />
                       </div>
                       <input 
                         type="url" 
                         placeholder="HTTPS://DRIVE.CLOUD/RESOURCES"
                         className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-100 dark:focus:border-primary-900/50 focus:bg-white dark:focus:bg-slate-950 focus:ring-[12px] focus:ring-primary-50 dark:focus:ring-primary-400/10 rounded-[28px] text-sm font-bold tracking-tight transition-all placeholder:text-slate-300 dark:text-slate-700 dark:text-white" 
                         value={formData.driveLink}
                         onChange={(e) => setFormData({...formData, driveLink: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row items-center gap-6">
                 <button 
                   type="button"
                   onClick={onClose}
                   className="w-full sm:flex-1 py-6 border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 font-black rounded-[30px] hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white hover:text-slate-900 transition-all text-[11px] uppercase tracking-[0.3em]"
                 >
                   Discard Forge
                 </button>
                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full sm:flex-[2] py-6 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-[30px] hover:bg-primary-600 dark:hover:bg-primary-400 shadow-3xl active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em] flex items-center justify-center space-x-4 relative overflow-hidden group"
                 >
                   {isSubmitting ? (
                     <div className="w-6 h-6 border-4 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
                   ) : (
                     <>
                       <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <span className="relative z-10">Broadcast Distribution</span>
                       <Send size={20} className="relative z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" strokeWidth={2.5} />
                     </>
                   )}
                 </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateAssignmentModal;
