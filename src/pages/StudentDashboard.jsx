import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, BookOpen, Clock, Settings, User, Bell, Search, GraduationCap, ChevronRight, LogOut, CheckCircle, ClipboardList, Send, Calendar, FileText, CheckCircle2, Menu, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Context & Hooks
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Service layer
import { getAssignmentsByStudent, submitAssignment } from '../utils/assignmentService';

// Unified Components
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import StatCard from '../components/dashboard/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import SubmissionModal from '../components/modals/SubmissionModal';
import LoadingOverlay from '../components/ui/LoadingOverlay';

/**
 * Student Central: The primary entry point for student academic monitoring.
 */
const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Dashboard Status States
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filtering & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'submitted', 'pending'
  
  // Interaction States
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const syncTimer = setTimeout(() => {
      fetchAssignmentData();
      setIsLoading(false);
    }, 1200); 
    return () => clearTimeout(syncTimer);
  }, [user]);

  const fetchAssignmentData = () => {
    if (user) {
      const studentData = getAssignmentsByStudent(user.id);
      setAssignments(studentData);
    }
  };

  const handleMarkAsSubmitted = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleConfirmSubmission = () => {
    if (selectedAssignment && user) {
      submitAssignment(selectedAssignment.id, user.id, "https://secure-vfs.io/blob-x92");
      setIsModalOpen(false);
      fetchAssignmentData(); 
    }
  };

  // Memoized Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'submitted' && item.status === 'submitted') ||
                           (filterStatus === 'pending' && item.status !== 'submitted');
      
      return matchesSearch && matchesFilter;
    });
  }, [assignments, searchQuery, filterStatus]);

  // Metric Computations
  const completedCount = assignments.filter(a => a.status === 'submitted').length;
  const totalCount = assignments.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const studentNavItems = [
    { name: 'Terminal Overview', icon: LayoutDashboard, active: true },
    { name: 'Core Curriculum', icon: BookOpen },
    { name: 'Task Matrix', icon: FileText },
    { name: 'User Profile', icon: User },
    { name: 'Interface Settings', icon: Settings }
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950' : 'bg-[#f8fafc]'}`}>
      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>

      <Sidebar 
        role="student"
        menuItems={studentNavItems}
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userName={user?.name}
      />

      <main className="flex-grow flex flex-col h-full relative transition-colors duration-300">
        <Navbar 
          role="student"
          userName={user?.name}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />

        <div className="flex-grow overflow-y-auto p-6 lg:p-12 space-y-10 lg:space-y-14">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter font-outfit uppercase">Student Nexus</h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 max-w-lg leading-relaxed text-sm lg:text-base uppercase tracking-widest opacity-60">
                Authorized entry confirmed. Monitoring academic trajectories in real-time.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-card p-10 min-w-full lg:min-w-[450px] bg-slate-900 text-white relative overflow-hidden shadow-2xl rounded-[40px]"
            >
               <div className="absolute -top-10 -right-10 p-20 text-slate-800 pointer-events-none opacity-10">
                  <GraduationCap size={240} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-400 block mb-2">Sync Completion</span>
                       <h4 className="text-3xl font-black font-outfit uppercase tracking-tighter">Cohort Status</h4>
                    </div>
                    <div className="text-5xl font-black font-outfit text-primary-500 tabular-nums">{progressPercent}%</div>
                 </div>
                 
                 <ProgressBar progress={progressPercent} height="h-6" />

                 <div className="flex justify-between items-center mt-8">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                       {completedCount} VALIDATED
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                       {totalCount - completedCount} PENDING
                    </div>
                 </div>
               </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 lg:gap-14 pb-14">
            
            <div className="xl:col-span-8 space-y-8 lg:space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-8 gap-6">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-wider">Evaluation Queue</h2>
                   <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-widest opacity-60">Pending Validation Packets</p>
                </div>

                <div className="flex items-center space-x-4">
                   <div className="relative group">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="SEARCH MATRIX..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all w-full sm:w-48"
                      />
                   </div>
                   <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                      {['all', 'pending', 'submitted'].map((status) => (
                        <button 
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-tighter rounded-lg transition-all ${filterStatus === status ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {status}
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              <motion.div layout className="space-y-6">
                <AnimatePresence mode='popLayout'>
                  {filteredAssignments.map((item, i) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 lg:p-10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] dark:hover:shadow-primary-900/10 hover:border-primary-100 dark:hover:border-primary-900 transition-all duration-500 flex flex-col md:flex-row md:items-center gap-8 lg:gap-12"
                    >
                      <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center shrink-0 transition-all group-hover:scale-110 group-hover:shadow-2xl duration-500 ${item.status === 'submitted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'}`}>
                        <FileText size={32} strokeWidth={2.5} />
                      </div>

                      <div className="flex-grow space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                           <h3 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase font-outfit">{item.title}</h3>
                           <span className={`self-start sm:self-auto px-4 py-1 text-[10px] font-black rounded-full border uppercase tracking-[0.2em] ${item.status === 'submitted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800'}`}>
                            {item.status.replace('_', ' ')}
                           </span>
                        </div>
                        <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 font-bold leading-relaxed opacity-80 border-l-4 border-slate-100 dark:border-slate-800 pl-6 italic">{item.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-6 lg:gap-10 pt-4">
                           <div className="flex items-center space-x-3 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                             <Calendar size={18} className="text-slate-300 dark:text-slate-600" />
                             <span>DEADLINE: {item.dueDate}</span>
                           </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center md:pt-0 pt-6 border-t md:border-t-0 border-slate-50 dark:border-slate-800">
                         {item.status !== 'submitted' ? (
                           <button 
                              onClick={() => handleMarkAsSubmitted(item)}
                              className="w-full md:w-auto px-10 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-[24px] hover:bg-primary-600 dark:hover:bg-primary-400 hover:shadow-2xl hover:shadow-primary-600/30 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-4 group"
                           >
                              <span>Transmit Work</span>
                              <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={2.5} />
                           </button>
                         ) : (
                           <div className="flex items-center space-x-3 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-8 py-5 rounded-[24px] border border-emerald-100 dark:border-emerald-800 shadow-sm">
                             <CheckCircle2 size={24} strokeWidth={2.5} />
                             <span className="text-xs font-black uppercase tracking-widest">Validated</span>
                           </div>
                         )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredAssignments.length === 0 && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[50px]">
                      <ClipboardList size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-6" />
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter">No Nodes Detected</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs opacity-60">Your query returned zero active evaluation packets.</p>
                      <button onClick={() => {setSearchQuery(''); setFilterStatus('all')}} className="mt-8 text-primary-500 font-black text-[10px] uppercase tracking-widest hover:underline">Reset Filters</button>
                   </motion.div>
                )}
              </motion.div>
            </div>

            {/* Sidebar Monitoring Column */}
            <div className="xl:col-span-4 space-y-10 lg:space-y-14">
              <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-8 uppercase">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-wider">Sync Log</h2>
              </div>
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[50px] p-10 space-y-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
                {[
                  { title: 'Interactive Workshop', time: '14:00 - 15:30', color: 'bg-rose-500', icon: 'IW' },
                  { title: 'Peer Review Session', time: '18:00 - 19:30', color: 'bg-indigo-600', icon: 'PR' },
                ].map((ev, i) => (
                  <div key={i} className="flex space-x-6 items-start group">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-sm text-white shadow-xl transition-all group-hover:rotate-6 group-hover:scale-110 ${ev.color}`}>
                       {ev.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white leading-none uppercase text-sm tracking-tight group-hover:text-primary-500 transition-colors">{ev.title}</h4>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-2 tracking-widest opacity-80 uppercase">{ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SubmissionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmission}
        assignmentTitle={selectedAssignment?.title}
      />
    </div>
  );
};

export default StudentDashboard;
