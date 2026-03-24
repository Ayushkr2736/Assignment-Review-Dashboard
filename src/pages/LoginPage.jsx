import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ShieldCheck, User, LogIn, ChevronRight, Sparkles, Zap, Fingerprint } from 'lucide-react';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate auth lag for premium feel
    setTimeout(() => {
      const userData = {
        id: role === 'admin' ? 'ADM001' : 'STU001',
        name: role === 'admin' ? 'Master Admin' : 'Ayush Kumar',
        role: role
      };
      
      login(userData);
      navigate(role === 'admin' ? '/admin' : '/student');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-200/40 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -90, -180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[100px]"
          />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
        className="relative z-10 w-full max-w-[1200px] flex flex-col lg:flex-row bg-white/40 backdrop-blur-3xl rounded-[60px] shadow-[0_80px_160px_rgba(0,0,0,0.1)] overflow-hidden border-8 border-white border-white hover:border-white transition-all duration-700"
      >
        {/* Left Section - Hero Brand */}
        <div className="lg:w-[45%] bg-slate-900 p-12 lg:p-20 text-white flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-indigo-900 opacity-90" />
           
           <div className="relative z-10 flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-[20px] backdrop-blur-xl border border-white/20 shadow-2xl">
                 <GraduationCap size={32} strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase font-outfit">LearnFlow</span>
           </div>

           <div className="relative z-10 py-20 lg:py-0">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.4 }}
                className="space-y-8"
              >
                 <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">
                    <Sparkles size={14} />
                    <span>Next-Gen Infrastructure</span>
                 </div>
                 <h2 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter uppercase font-outfit">
                    Unify Your <br/>
                    <span className="text-primary-500 italic decoration-primary-500/20 underline decoration-8 underline-offset-8">Academic</span> <br/>
                    Intelligence.
                 </h2>
                 <p className="text-lg lg:text-xl font-bold opacity-60 max-w-sm leading-relaxed tracking-tight border-l-4 border-primary-500 pl-8 italic">
                   The definitive platform for rapid curriculum distribution and outcome tracking.
                 </p>
              </motion.div>
           </div>

           <div className="relative z-10 flex items-center space-x-12 opacity-40">
              <div className="text-center">
                 <div className="text-2xl font-black">2.4k+</div>
                 <div className="text-[10px] uppercase font-black tracking-widest mt-1">Students</div>
              </div>
              <div className="text-center">
                 <div className="text-2xl font-black">98.2%</div>
                 <div className="text-[10px] uppercase font-black tracking-widest mt-1">Uptime</div>
              </div>
           </div>

           {/* Animated Background Graphics */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-[3s]">
              <Fingerprint size={600} strokeWidth={0.5} />
           </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex-grow p-12 lg:p-24 flex flex-col justify-center bg-white/60">
           <div className="max-w-md mx-auto w-full">
              <div className="mb-14">
                 <h3 className="text-4xl font-black font-outfit text-slate-900 tracking-tighter uppercase">Authorized Access</h3>
                 <p className="text-slate-500 font-bold mt-4 uppercase tracking-widest text-xs opacity-60">Identity Verification Required to proceed.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-10">
                 {/* Role Toggle */}
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Vector Identity</label>
                    <div className="grid grid-cols-2 gap-4 p-2 bg-slate-100/50 rounded-[28px] border-2 border-slate-50">
                       <button 
                         type="button"
                         onClick={() => setRole('student')}
                         className={`flex items-center justify-center space-x-3 py-4 rounded-[22px] transition-all duration-500 font-black text-[11px] uppercase tracking-widest ${role === 'student' ? 'bg-white text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)] scale-100' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                          <User size={18} />
                          <span>Student</span>
                       </button>
                       <button 
                         type="button"
                         onClick={() => setRole('admin')}
                         className={`flex items-center justify-center space-x-3 py-4 rounded-[22px] transition-all duration-500 font-black text-[11px] uppercase tracking-widest ${role === 'admin' ? 'bg-slate-900 text-white shadow-2xl scale-100' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                          <ShieldCheck size={18} />
                          <span>Admin</span>
                       </button>
                    </div>
                 </div>

                 {/* Simulated Credentials */}
                 <div className="space-y-6">
                    <div className="space-y-2 group">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 group-focus-within:text-primary-600 transition-colors">Neural Key (EMail)</label>
                       <input 
                         type="email" 
                         disabled
                         className="w-full px-8 py-5 bg-slate-100 border-2 border-transparent focus:border-primary-100 focus:bg-white focus:ring-[10px] focus:ring-primary-50 rounded-[24px] text-sm font-bold tracking-tight transition-all text-slate-500 italic opacity-60" 
                         placeholder={role === 'admin' ? 'admin@learnflow.io' : 'student@university.edu'}
                       />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 group-focus-within:text-primary-600 transition-colors">Cryptographic Hash (PWD)</label>
                       <input 
                         type="password" 
                         disabled
                         className="w-full px-8 py-5 bg-slate-100 border-2 border-transparent focus:border-primary-100 focus:bg-white focus:ring-[10px] focus:ring-primary-50 rounded-[24px] text-sm font-bold tracking-tight transition-all text-slate-500 italic opacity-60" 
                         placeholder="••••••••••••••••"
                       />
                    </div>
                 </div>

                 <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full relative group py-6 rounded-[28px] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl transition-all duration-500 transform active:scale-95 ${role === 'admin' ? 'bg-indigo-600 text-white hover:bg-slate-900 shadow-indigo-200' : 'bg-primary-600 text-white hover:bg-slate-900 shadow-primary-200'}`}
                 >
                    <AnimatePresence mode='wait'>
                       {isSubmitting ? (
                         <motion.div 
                           key="loading"
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="flex items-center justify-center space-x-3"
                         >
                            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Validating Neural ID...</span>
                         </motion.div>
                       ) : (
                         <motion.div 
                           key="idle"
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="flex items-center justify-center space-x-3"
                         >
                            <LogIn size={18} strokeWidth={2.5} />
                            <span>Establish Connection</span>
                            <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </button>
              </form>

              <div className="mt-14 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Restricted Terminal 
                 </p>
                 <div className="flex items-center justify-center space-x-4 mt-6">
                    <Zap size={20} className="text-primary-300" />
                    <div className="w-px h-6 bg-slate-200" />
                    <Sparkles size={20} className="text-primary-300" />
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
