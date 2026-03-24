import React from 'react';
import { Menu, Search, Bell, GraduationCap, ShieldCheck } from 'lucide-react';
import RoleBadge from '../ui/RoleBadge';
import ThemeToggle from '../ThemeToggle';

/**
 * Reusable Navbar component for Dashboards.
 */
const Navbar = ({ 
  role = 'student', 
  userName = 'User', 
  onMenuToggle, 
  onActionClick 
}) => {
  const isAdmin = role === 'admin';
  const AvatarIcon = isAdmin ? ShieldCheck : GraduationCap;
  
  return (
    <header className="h-24 flex items-center justify-between px-6 lg:px-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl border-b border-slate-100/50 dark:border-slate-800/50 sticky top-0 z-40 transition-colors duration-300">
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center space-x-4 lg:hidden">
         <button 
           onClick={onMenuToggle} 
           className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 shadow-sm active:scale-95 transition-transform"
         >
            <Menu size={24} />
         </button>
         <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center text-white shadow-lg ${isAdmin ? 'bg-primary-600 shadow-primary-500/20' : 'bg-primary-600 shadow-primary-500/20'}`}>
            <AvatarIcon size={20} />
         </div>
      </div>

      {/* Desktop Search */}
      <div className="hidden lg:flex relative group w-[500px]">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 dark:text-slate-600 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">
          <Search size={22} strokeWidth={2.5} />
        </div>
        <input 
          type="text" 
          placeholder={isAdmin ? "Search students, assignments, logs..." : "Search evaluations, documents..."} 
          className="w-full pl-16 pr-8 py-4 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-primary-100 dark:focus:border-primary-900 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-400/10 rounded-[24px] text-sm font-bold tracking-tight transition-all placeholder:text-slate-400 dark:text-white"
        />
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center space-x-5 lg:space-x-8">
        {isAdmin && onActionClick && (
          <button 
             onClick={onActionClick}
             className="hidden sm:flex items-center space-x-3 px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[24px] hover:bg-primary-600 dark:hover:bg-primary-400 hover:shadow-2xl hover:shadow-primary-600/30 active:scale-95 transition-all group"
          >
             <span className="italic opacity-80 decoration-primary-400 decoration-2">Post Evaluation</span>
          </button>
        )}
        
        <ThemeToggle />

        <button className="relative p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[18px] text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm active:scale-95">
          <Bell size={24} strokeWidth={2.5} />
          <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-rose-500 rounded-full border-[3px] border-white dark:border-slate-800"></span>
        </button>
        
        <div className="flex items-center space-x-4 pr-2">
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end space-x-2">
               <RoleBadge role={role} />
               <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{userName}</span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-[0.2em] mt-1 uppercase leading-none italic opacity-60">Session Validated</div>
          </div>
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-[22px] bg-slate-100 dark:bg-slate-800 p-1 border-2 border-white dark:border-slate-800 shadow-xl ring-1 ring-slate-100 dark:ring-slate-800 shrink-0">
            <img 
               src={`https://ui-avatars.com/api/?name=${userName}&background=${isAdmin ? '0F172A' : '063d91'}&color=fff&bold=true&rounded=true`} 
               className="rounded-[18px] w-full h-full object-cover" 
               alt="User profile" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
