import React, { useState, useMemo } from 'react';
import { LayoutDashboard, BookOpen, Clock, Settings, User, Search, GraduationCap, ClipboardList, Send, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Context & Hooks
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStudentAssignments } from '../hooks/useAssignments';

// Components
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ProgressBar from '../components/ui/ProgressBar';
import SubmissionModal from '../components/modals/SubmissionModal';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import Toast from '../components/ui/Toast';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Custom Hook replaces inline fetching logic
  const { assignments, isLoading, error, stats, completeAssignment } = useStudentAssignments(user?.id);
  
  // UI & Interaction States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'submitted', 'pending'
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  // Event Handlers
  const handleMarkAsSubmitted = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleConfirmSubmission = () => {
    if (selectedAssignment) {
      const success = completeAssignment(selectedAssignment.id, "https://github.com/example/submission");
      
      setIsModalOpen(false);
      
      if (success) {
        setToast({ isOpen: true, message: 'Assignment submitted successfully!', type: 'success' });
      } else {
        setToast({ isOpen: true, message: 'Failed to submit assignment', type: 'error' });
      }
    }
  };

  // Filter Logic
  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const statusMatch = filterStatus === 'all' || 
                         (filterStatus === 'submitted' && item.status === 'submitted') ||
                         (filterStatus === 'pending' && item.status !== 'submitted');
      
      return searchMatch && statusMatch;
    });
  }, [assignments, searchQuery, filterStatus]);

  // Navigation Setup
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'My Courses', icon: BookOpen },
    { name: 'Assignments', icon: FileText },
    { name: 'Profile', icon: User },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950' : 'bg-[#f8fafc]'}`}>
      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>

      {/* Sidebar navigation */}
      <Sidebar 
        role="student"
        menuItems={navItems}
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userName={user?.name}
      />

      {/* Main dashboard view */}
      <main className="flex-grow flex flex-col h-full relative transition-colors duration-300">
        <Navbar 
          role="student"
          userName={user?.name}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />

        <div className="flex-grow overflow-y-auto p-6 lg:p-12 space-y-10 lg:space-y-14">
          
          {/* Header & Stats Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter font-outfit">Student Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 max-w-lg leading-relaxed text-sm lg:text-base opacity-80">
                Track your active assignments, upcoming deadlines, and academic progress.
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
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-400 block mb-1">Course Progress</span>
                       <h4 className="text-3xl font-black font-outfit tracking-tighter">Completion Rate</h4>
                    </div>
                    <div className="text-5xl font-black font-outfit text-primary-500 tabular-nums">{stats.percentage}%</div>
                 </div>
                 
                 <ProgressBar progress={stats.percentage} height="h-6" />

                 <div className="flex justify-between items-center mt-8 gap-4">
                    <div className="flex-1 text-center text-xs font-bold text-slate-300 bg-white/5 p-3 rounded-2xl border border-white/10">
                       <span className="block text-xl font-black text-white mb-1">{stats.completed}</span>
                       Submitted
                    </div>
                    <div className="flex-1 text-center text-xs font-bold text-slate-300 bg-white/5 p-3 rounded-2xl border border-white/10">
                       <span className="block text-xl font-black text-white mb-1">{stats.pending}</span>
                       Pending
                    </div>
                 </div>
               </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 lg:gap-14 pb-14">
            
            {/* Active Assignments Column */}
            <div className="xl:col-span-8 flex flex-col gap-6 lg:gap-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-6 gap-6">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Active Assignments</h2>
                   <p className="text-sm text-slate-400 font-medium mt-1">Assignments assigned to you</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                   <div className="relative group w-full sm:w-auto">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search assignments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all w-full sm:w-56"
                      />
                   </div>
                   
                   <div className="flex items-center w-full sm:w-auto bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[16px]">
                      {['all', 'pending', 'submitted'].map((status) => (
                        <button 
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold capitalize rounded-xl transition-all ${filterStatus === status ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                          {status}
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              {/* Error State Component */}
              {error && (
                <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-6 rounded-[24px] border border-rose-100 dark:border-rose-900 text-center font-medium">
                  {error}
                </div>
              )}

              {/* Assignment List */}
              <motion.div layout className="flex flex-col gap-6">
                <AnimatePresence mode='popLayout'>
                  {filteredAssignments.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.98 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 lg:p-8 hover:shadow-xl dark:hover:shadow-primary-900/5 hover:border-primary-200 dark:hover:border-primary-900 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6"
                    >
                      <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center shrink-0 transition-all duration-300 ${item.status === 'submitted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'}`}>
                        <FileText size={28} strokeWidth={2} />
                      </div>

                      <div className="flex-grow space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">{item.title}</h3>
                           <span className={`self-start sm:self-auto px-3 py-1 text-[10px] font-bold rounded-full capitalize ${item.status === 'submitted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 border' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 border'}`}>
                            {item.status === 'submitted' ? 'Submitted' : 'Pending'}
                           </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-l-2 border-slate-200 dark:border-slate-800 pl-4">{item.description}</p>
                        
                        <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-400">
                           <Calendar size={14} />
                           <span>Due: {item.dueDate}</span>
                        </div>
                      </div>

                      <div className="shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 text-right">
                         {item.status !== 'submitted' ? (
                           <button 
                              onClick={() => handleMarkAsSubmitted(item)}
                              className="w-full md:w-auto px-8 py-4 bg-primary-600 dark:bg-primary-500 text-white font-bold text-sm rounded-xl hover:bg-primary-700 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
                           >
                              <span>Submit Work</span>
                              <Send size={16} />
                           </button>
                         ) : (
                           <div className="flex justify-center md:justify-end items-center space-x-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-6 py-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                             <CheckCircle2 size={20} />
                             <span className="text-sm font-bold">Checked</span>
                           </div>
                         )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {!isLoading && filteredAssignments.length === 0 && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-[32px]">
                      <ClipboardList size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white font-outfit">No Assignments Found</h3>
                      <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">We couldn't find any assignments matching your current filters. Check back later.</p>
                      {(searchQuery !== '' || filterStatus !== 'all') && (
                        <button onClick={() => {setSearchQuery(''); setFilterStatus('all')}} className="mt-6 text-primary-600 font-medium text-sm hover:underline">Clear all filters</button>
                      )}
                   </motion.div>
                )}
              </motion.div>
            </div>

            {/* Schedule / Sidebar Column */}
            <div className="xl:col-span-4 space-y-6 lg:space-y-8">
              <div className="border-b-2 border-slate-100 dark:border-slate-800 pb-6">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white font-outfit tracking-tight">Upcoming Schedule</h2>
                 <p className="text-sm text-slate-400 font-medium mt-1">Events and workshops</p>
              </div>
              
              <div className="flex flex-col gap-4">
                {[
                  { title: 'React Performance Workshop', time: 'Today, 2:00 PM', color: 'bg-primary-500', icon: '📝' },
                  { title: '1-on-1 Mentor Review', time: 'Tomorrow, 4:30 PM', color: 'bg-indigo-500', icon: '👥' },
                ].map((ev, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-5 hover:border-primary-200 transition-colors">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-md ${ev.color}`}>
                       {ev.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{ev.title}</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5"><Clock size={14} /> {ev.time}</p>
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

      <Toast 
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default StudentDashboard;
