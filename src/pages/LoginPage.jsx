import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ShieldCheck, User, LogIn, ChevronRight, Lock, Mail } from 'lucide-react';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      const userData = {
        id: role === 'admin' ? 'ADM001' : 'STU001',
        name: role === 'admin' ? 'Admin User' : 'Ayush Kumar',
        role: role
      };
      
      login(userData);
      navigate(role === 'admin' ? '/admin' : '/student');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-100/50 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-[80px]"
          />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden"
      >
        {/* Left Section - Branding */}
        <div className="lg:w-[45%] bg-slate-900 p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-950 to-indigo-950 opacity-90" />
           
           <div className="relative z-10 flex items-center space-x-3 mb-10 lg:mb-0">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                 <GraduationCap size={28} />
              </div>
              <span className="text-2xl font-bold tracking-tight font-outfit">LearnFlow</span>
           </div>

           <div className="relative z-10 py-12 lg:py-0">
              <div className="space-y-6">
                 <h2 className="text-4xl lg:text-5xl font-bold leading-tight font-outfit">
                    Managing your <br/>
                    <span className="text-primary-400">assignments</span> <br/>
                    made easier.
                 </h2>
                 <p className="text-lg text-slate-300 max-w-sm leading-relaxed border-l-2 border-primary-500 pl-6">
                   A clean, intuitive platform for distributing coursework and tracking student success.
                 </p>
              </div>
           </div>

           <div className="relative z-10 flex text-sm font-medium text-slate-400 space-x-8 mt-10 lg:mt-0">
              <div>
                 <div className="text-white font-bold text-xl mb-1">2.4k+</div>
                 <div>Active Students</div>
              </div>
              <div>
                 <div className="text-white font-bold text-xl mb-1">99.9%</div>
                 <div>System Uptime</div>
              </div>
           </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex-grow p-10 lg:p-20 flex flex-col justify-center bg-white">
           <div className="max-w-md mx-auto w-full">
              <div className="mb-10 text-center lg:text-left">
                 <h3 className="text-3xl font-bold font-outfit text-slate-900">Sign in to your account</h3>
                 <p className="text-slate-500 text-sm mt-3">Select your role to access the dashboard.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-8">
                 {/* Role Selection */}
                 <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Account Type</label>
                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                       <button 
                         type="button"
                         onClick={() => setRole('student')}
                         className={`flex items-center justify-center space-x-2 py-3.5 rounded-xl transition-all font-semibold text-sm ${role === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                          <User size={18} />
                          <span>Student</span>
                       </button>
                       <button 
                         type="button"
                         onClick={() => setRole('admin')}
                         className={`flex items-center justify-center space-x-2 py-3.5 rounded-xl transition-all font-semibold text-sm ${role === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                          <ShieldCheck size={18} />
                          <span>Instructor</span>
                       </button>
                    </div>
                 </div>

                 {/* Credentials */}
                 <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <Mail size={18} className="text-slate-400" />
                         </div>
                         <input 
                           type="email" 
                           disabled
                           className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-sm font-medium transition-all text-slate-600 outline-none" 
                           placeholder={role === 'admin' ? 'instructor@university.edu' : 'student@university.edu'}
                         />
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                         <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-700">Forgot password?</a>
                       </div>
                       <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <Lock size={18} className="text-slate-400" />
                         </div>
                         <input 
                           type="password" 
                           disabled
                           className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 rounded-2xl text-sm font-medium transition-all text-slate-600 outline-none" 
                           placeholder="••••••••"
                         />
                       </div>
                    </div>
                 </div>

                 <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full relative group py-4 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] ${role === 'admin' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                 >
                    <AnimatePresence mode='wait'>
                       {isSubmitting ? (
                         <motion.div 
                           key="loading"
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="flex items-center justify-center space-x-2"
                         >
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Authenticating...</span>
                         </motion.div>
                       ) : (
                         <motion.div 
                           key="idle"
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="flex items-center justify-center space-x-2"
                         >
                            <LogIn size={18} />
                            <span>Sign In as {role === 'admin' ? 'Instructor' : 'Student'}</span>
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </button>
              </form>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
