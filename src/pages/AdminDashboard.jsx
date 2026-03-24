import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Users, UserCheck, Settings, Search, Database, FileText, ChevronDown, ExternalLink, Clock, CheckCircle2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Context & Hooks
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAdminAssignments } from '../hooks/useAssignments';

// Components
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import StatCard from '../components/dashboard/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import CreateAssignmentModal from '../components/modals/CreateAssignmentModal';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import Toast from '../components/ui/Toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Custom hook extracts business logic
  const { assignments, submissions, isLoading, error, addAssignment } = useAdminAssignments(user?.id);
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, active, completed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const handleCreateAssignment = (formData) => {
    const success = addAssignment(formData);
    setIsModalOpen(false);
    
    if (success) {
      setToast({ isOpen: true, message: 'Assignment created successfully!', type: 'success' });
    } else {
      setToast({ isOpen: true, message: 'Failed to create assignment.', type: 'error' });
    }
  };

  // Memoized Filters
  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const isSearchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const studentList = submissions[item.id] || [];
      const submittedCount = studentList.filter(s => s.status === 'submitted').length;
      const isCompleted = studentList.length > 0 && submittedCount === studentList.length;

      const isFilterMatch = filterType === 'all' || 
                           (filterType === 'completed' && isCompleted) ||
                           (filterType === 'active' && !isCompleted);
      
      return isSearchMatch && isFilterMatch;
    });
  }, [assignments, searchQuery, filterType, submissions]);

  const toggleAssignmentExpand = (id) => {
    setExpandedAssignment(expandedAssignment === id ? null : id);
  };

  const calculateProgress = (id) => {
    const studentList = submissions[id] || [];
    const submittedCount = studentList.filter(s => s.status === 'submitted').length;
    return {
      count: submittedCount,
      total: studentList.length,
      percent: studentList.length > 0 ? Math.round((submittedCount / studentList.length) * 100) : 0
    };
  };

  // Nav Items Setup
  const navItems = [
    { name: 'Dashboard Overview', icon: LayoutDashboard, active: true },
    { name: 'Curriculum Manager', icon: FileText },
    { name: 'Student Registry', icon: Users },
    { name: 'Metrics Analysis', icon: Database },
    { name: 'System Settings', icon: Settings }
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>

      <Sidebar 
        role="admin"
        menuItems={navItems}
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userName={user?.name}
      />

      <main className="flex-grow flex flex-col h-full relative transition-colors duration-300">
        <Navbar 
          role="admin"
          userName={user?.name}
          onMenuToggle={() => setIsSidebarOpen(true)}
          onActionClick={() => setIsModalOpen(true)}
        />

        <div className="flex-grow overflow-y-auto p-6 lg:p-12 space-y-10 lg:space-y-12">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            <StatCard 
              label="Active Assignments" 
              value={assignments.length} 
              status="Live active tasks" 
              icon={FileText} 
              colorClasses="text-primary-600 dark:text-primary-400" 
              bgClasses="bg-primary-50 dark:bg-primary-950/20" 
              delay={0.1}
            />
            <StatCard 
              label="Pending Reviews" 
              value={Object.values(submissions).flat().filter(s => s.status === 'submitted').length} 
              status="Need grading" 
              icon={UserCheck} 
              colorClasses="text-emerald-600 dark:text-emerald-400" 
              bgClasses="bg-emerald-50 dark:bg-emerald-950/20" 
              delay={0.2}
            />
            <StatCard 
              label="Total Students" 
              value={Object.values(submissions)[0]?.length || 0} 
              status="Enrolled members" 
              icon={Users} 
              colorClasses="text-indigo-600 dark:text-indigo-400" 
              bgClasses="bg-indigo-50 dark:bg-indigo-950/20" 
              delay={0.3}
            />
             <StatCard 
              label="Completion Rate" 
              value="84%" 
              status="Global aggregate" 
              icon={Database} 
              colorClasses="text-amber-600 dark:text-amber-400" 
              bgClasses="bg-amber-50 dark:bg-amber-950/20" 
              delay={0.4}
            />
          </div>

          <div className="space-y-8">
            {/* Header & Filters */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-6">
               <div>
                  <h3 className="text-3xl font-black font-outfit tracking-tighter">Assignments Manager</h3>
                  <p className="text-sm font-medium text-slate-500 mt-2">Manage all curriculum files and track student progress visually.</p>
               </div>

               <div className="flex flex-wrap items-center gap-4">
                  <div className="relative group w-full sm:w-auto">
                     <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                     <input 
                       type="text" 
                       placeholder="Find assignment..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="pl-12 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none w-full sm:w-64"
                     />
                  </div>
                  <div className="flex items-center w-full sm:w-auto bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[16px]">
                     {[
                       { id: 'all', label: 'All Files' },
                       { id: 'active', label: 'Active' },
                       { id: 'completed', label: 'Completed' }
                     ].map((item) => (
                       <button 
                         key={item.id}
                         onClick={() => setFilterType(item.id)}
                         className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-xl transition-all ${filterType === item.id ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                       >
                         {item.label}
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            {error && (
               <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold border border-rose-100">
                  {error}
               </div>
            )}

            {/* List Array */}
            <motion.div layout className="flex flex-col gap-6 lg:gap-8">
               <AnimatePresence mode='popLayout'>
                 {filteredAssignments.map((item) => {
                    const progress = calculateProgress(item.id);
                    const isExpanded = expandedAssignment === item.id;

                    return (
                      <motion.div 
                         key={item.id} 
                         layout
                         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                         className={`bg-white dark:bg-slate-900 border rounded-[32px] overflow-hidden transition-all duration-300 hover:shadow-xl dark:shadow-none ${isExpanded ? 'border-primary-400 dark:border-primary-700 shadow-2xl ring-4 ring-primary-50 dark:ring-primary-900/10' : 'border-slate-200 dark:border-slate-800'}`}
                      >
                         <div onClick={() => toggleAssignmentExpand(item.id)} className="p-6 lg:p-10 cursor-pointer group flex flex-col xl:flex-row xl:items-center gap-6 xl:gap-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="w-16 h-16 rounded-[20px] bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center shrink-0">
                               <FileText size={28} strokeWidth={2.5} />
                            </div>

                            <div className="flex-grow space-y-2">
                               <h4 className="text-xl lg:text-3xl font-bold font-outfit">{item.title}</h4>
                               <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 max-w-2xl font-medium">{item.description}</p>
                               <div className="flex flex-wrap items-center gap-4 pt-2">
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                                     <Clock size={16} />
                                     <span>Due: {item.dueDate}</span>
                                  </div>
                                  <a href={item.driveLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 px-3 py-1.5 rounded-lg hover:underline decoration-indigo-300">
                                     <ExternalLink size={16} />
                                     Project Specs
                                  </a>
                               </div>
                            </div>

                            {/* Progress Indicator */}
                            <div className="w-full xl:w-72 space-y-3">
                               <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                                  <span>Completion Rate</span>
                                  <span className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{progress.count} / {progress.total}</span>
                               </div>
                               <ProgressBar progress={progress.percent} height="h-3" />
                            </div>
                            
                            <div className="shrink-0 hidden xl:flex text-slate-400 group-hover:text-primary-600 mt-4 xl:mt-0 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                               <ChevronDown size={28} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                         </div>

                         {/* Expanded View */}
                         <AnimatePresence>
                            {isExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                 <div className="p-6 lg:p-10 pt-0 overflow-x-auto">
                                    <table className="w-full text-left mt-6">
                                       <thead>
                                          <tr className="text-xs font-bold text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                                             <th className="pb-4 px-4 font-outfit">Student Name</th>
                                             <th className="pb-4 px-4 font-outfit">Email Bound</th>
                                             <th className="pb-4 px-4 font-outfit">Review Status</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                          {submissions[item.id]?.map((student, idx) => (
                                            <tr key={idx} className="hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                               <td className="py-4 px-4">
                                                  <div className="flex items-center space-x-3">
                                                     <div className="w-10 h-10 bg-slate-800 dark:bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                        {student.name.charAt(0)}
                                                     </div>
                                                     <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{student.name}</span>
                                                  </div>
                                               </td>
                                               <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                                                  {student.email}
                                               </td>
                                               <td className="py-4 px-4 flex items-center gap-2">
                                                  {student.status === 'submitted' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                                      <CheckCircle2 size={16} /> Submitted
                                                    </span>
                                                  ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Pending
                                                    </span>
                                                  )}
                                               </td>
                                            </tr>
                                          ))}
                                       </tbody>
                                    </table>
                                 </div>
                              </motion.div>
                            )}
                         </AnimatePresence>
                      </motion.div>
                    );
                 })}
               </AnimatePresence>

               {/* Empty State */}
               {!isLoading && filteredAssignments.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-[32px]">
                     <Database size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                     <h3 className="text-2xl font-black font-outfit text-slate-800 dark:text-slate-200">No Assignments Found</h3>
                     <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">Either no assignments have been created, or your search filter is too specific.</p>
                     <button onClick={() => {setSearchQuery(''); setFilterType('all')}} className="mt-6 font-bold text-sm text-primary-600 hover:text-primary-700 underline">Reset all filters</button>
                  </motion.div>
               )}
            </motion.div>
          </div>
        </div>
      </main>

      <CreateAssignmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateAssignment}
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

export default AdminDashboard;
