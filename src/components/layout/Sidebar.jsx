import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, GraduationCap, ShieldCheck, X } from 'lucide-react';

/**
 * Reusable Sidebar component for both Student and Admin views.
 * Unified design language with distinct role personalities and support for dark mode.
 */
const Sidebar = ({ 
  role = 'student', 
  menuItems = [], 
  onLogout, 
  isOpen, 
  onClose,
  userName = 'User'
}) => {
  const isAdmin = role === 'admin';
  const BrandIcon = isAdmin ? ShieldCheck : GraduationCap;
  
  const sidebarClasses = isAdmin 
    ? "w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-900 text-white" 
    : "w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white";

  const Content = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-4 mb-14 pl-2 group">
        <div className={`p-4 rounded-[22px] flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:rotate-12 ${isAdmin ? 'bg-primary-600 shadow-primary-500/20' : 'bg-primary-600 shadow-primary-500/20'}`}>
          <BrandIcon size={30} strokeWidth={2.5} />
        </div>
        <div>
           <span className={`text-2xl font-black font-outfit tracking-tighter leading-none block ${isAdmin || 'dark' ? 'text-white' : 'text-slate-900'}`}>
             {isAdmin ? 'AdminCore' : 'LearnFlow'}
           </span>
           <span className="text-[9px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-[0.4em] mt-1 block">Vector Protocol</span>
        </div>
      </div>

      <nav className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item, index) => (
          <button 
            key={index} 
            className={`flex items-center space-x-4 w-full px-6 py-5 rounded-[24px] transition-all duration-300 font-bold text-sm tracking-tight group relative overflow-hidden ${
              item.active 
                ? (isAdmin ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/20 active:scale-95' : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white shadow-2xl shadow-slate-900/10 active:scale-95') 
                : (isAdmin ? 'text-slate-500 hover:bg-slate-800 hover:text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white')
            }`}
          >
            <item.icon size={22} strokeWidth={2.5} className="relative z-10" />
            <span className="uppercase tracking-[0.15em] text-[10px] font-black relative z-10">{item.name}</span>
            {item.active && isAdmin && <motion.div layoutId="nav-bg" className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-500" />}
          </button>
        ))}
      </nav>

      <div className={`mt-auto pt-10 border-t ${isAdmin ? 'border-slate-800' : 'border-slate-100 dark:border-slate-800'}`}>
        <button 
          onClick={onLogout}
          className={`flex items-center space-x-4 w-full px-6 py-6 rounded-[24px] transition-all duration-300 font-black text-[10px] uppercase tracking-[0.3em] group ${
            isAdmin ? 'text-rose-500 hover:bg-rose-500/10' : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 group-hover:pl-8'
          }`}
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          <span>Exit Workspace</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className={`${sidebarClasses} hidden lg:flex flex-col p-10 z-50 transition-colors duration-300`}>
        <Content />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '-100%', skewX: -10 }} 
              animate={{ x: 0, skewX: 0 }} 
              exit={{ x: '-100%', skewX: 10 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className={`absolute inset-y-0 left-0 w-[85%] max-w-[340px] p-10 flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] ${isAdmin ? 'bg-slate-900' : 'bg-white dark:bg-slate-900'}`}
            >
              <button 
                onClick={onClose} 
                className={`absolute top-8 right-8 p-4 rounded-2xl active:scale-90 transition-transform ${isAdmin ? 'bg-slate-800 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
              >
                <X size={24} strokeWidth={2.5} />
              </button>
              <Content />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
