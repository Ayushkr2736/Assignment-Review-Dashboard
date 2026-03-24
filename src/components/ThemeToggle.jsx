import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[18px] text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm active:scale-90"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        {isDarkMode ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
