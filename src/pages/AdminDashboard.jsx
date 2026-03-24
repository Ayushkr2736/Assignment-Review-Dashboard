import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, Users, UserCheck, Settings, Bell, Search, ShieldCheck, Mail, LogOut, MoreHorizontal, Download, Plus, FileText, ChevronDown, ChevronUp, ExternalLink, Clock, CheckCircle2, Menu, X, Database, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Context & Hooks
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Service layer
import { getAssignmentsByAdmin, createAssignment, getStudentsByAssignment } from '../utils/assignmentService';

// Unified Components
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import StatCard from '../components/dashboard/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import CreateAssignmentModal from '../components/modals/CreateAssignmentModal';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import Toast from '../components/ui/Toast';

/**
 * Admin Core: Secure command center for curriculum distribution and student tracking.
 */
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Dashboard Status States
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, active, completed

  // Interaction & Expansion States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState({});

  // Toast States
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ isOpen: true, message, type });
  };

  useEffect(() => {
    const syncTimer = setTimeout(() => {
      fetchAdminData();
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(syncTimer);
  }, [user]);

  const fetchAdminData = () => {
    if (user) {
      const adminPackages = getAssignmentsByAdmin(user.id);
      setAssignments(adminPackages);
      
      const submissionsMap = {};
      adminPackages.forEach(pkg => {
        submissionsMap[pkg.id] = getStudentsByAssignment(pkg.id);
      });
      setAssignmentSubmissions(submissionsMap);
    }
  };

  const handlePostDistribution = (formData) => {
    if (user) {
      createAssignment({ ...formData, createdBy: user.id });
      setIsModalOpen(false);
      fetchAdminData();
      showToast("CURRICULUM NODE ESTABLISHED", "success");
    }
  };

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const students = assignmentSubmissions[item.id] || [];
      const submittedCount = students.filter(s => s.status === 'submitted').length;
      const isCompleted = students.length > 0 && submittedCount === students.length;

      const matchesFilter = filterType === 'all' || 
                           (filterType === 'completed' && isCompleted) ||
                           (filterType === 'active' && !isCompleted);
      
      return matchesSearch && matchesFilter;
    });
  }, [assignments, searchQuery, filterType, assignmentSubmissions]);

  const toggleMatrixExpand = (id) => {
    setExpandedAssignment(expandedAssignment === id ? null : id);
  };

  const calculateProgress = (id) => {
    const students = assignmentSubmissions[id] || [];
    const submitted = students.filter(s => s.status === 'submitted').length;
    return {
      count: submitted,
      total: students.length,
      percent: students.length > 0 ? (submitted / students.length) * 100 : 0
    };
  };

  const adminNavItems = [
    { name: 'Command Center', icon: LayoutDashboard, active: true },
    { name: 'Curriculum Forge', icon: FileText },
    { name: 'Student Registry', icon: Users },
    { name: 'Metrics Analysis', icon: Database },
    { name: 'Core Settings', icon: Settings }
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950' : 'bg-[#f8fafc]'}`}>
      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>

      <Sidebar 
        role="admin"
        menuItems={adminNavItems}
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

        <div className="flex-grow overflow-y-auto p-6 lg:p-12 space-y-10 lg:space-y-16 pb-32">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard 
              label="Active Nodes" 
              value={assignments.length} 
              status="Live distributions" 
              icon={FileText} 
              colorClasses="text-primary-600 dark:text-primary-400" 
              bgClasses="bg-primary-50 dark:bg-primary-950/20" 
              delay={0.1}
            />
            <StatCard 
              label="Pending Validation" 
              value={Object.values(assignmentSubmissions).flat().filter(s => s.status === 'submitted').length} 
              status="Outcome check required" 
              icon={UserCheck} 
              colorClasses="text-emerald-600 dark:text-emerald-400" 
              bgClasses="bg-emerald-50 dark:bg-emerald-950/20" 
              delay={0.2}
            />
            <StatCard 
              label="Ecosystem Total" 
              value={Object.values(assignmentSubmissions)[0]?.length || 0} 
              status="Verified students" 
              icon={Users} 
              colorClasses="text-indigo-600 dark:text-indigo-400" 
              bgClasses="bg-indigo-50 dark:bg-indigo-950/20" 
              delay={0.3}
            />
             <StatCard 
              label="Success Curve" 
              value="84%" 
              status="Global aggregate" 
              icon={Database} 
              colorClasses="text-rose-600 dark:text-rose-400" 
              bgClasses="bg-rose-50 dark:bg-rose-950/20" 
              delay={0.4}
            />
          </div>

          <div className="space-y-10 lg:space-y-14">
             <div className="flex flex-col xl:flex-row xl:items-end justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-8 gap-6">
                <div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter text-3xl">Matrix Overview</h3>
                   <p className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase mt-2 tracking-widest opacity-60 italic">Synchronized curriculum tracking</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                   <div className="relative group">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="FILTER MATRIX..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all w-full md:w-64"
                      />
                   </div>
                   <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[20px]">
                      {[
                        { id: 'all', label: 'ALL MODULES' },
                        { id: 'active', label: 'ONGOING' },
                        { id: 'completed', label: 'ARCHIVED' }
                      ].map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => setFilterType(item.id)}
                          className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${filterType === item.id ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 active:scale-95' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <motion.div layout className="grid grid-cols-1 gap-8 transition-all">
                <AnimatePresence mode='popLayout'>
                  {filteredAssignments.map((item, i) => {
                     const progress = calculateProgress(item.id);
                     const isExpanded = expandedAssignment === item.id;

                     return (
                       <motion.div 
                          key={item.id} 
                          layout
                          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.6 }}
                          className={`bg-white dark:bg-slate-900 border-2 rounded-[50px] overflow-hidden transition-all duration-700 hover:shadow-[0_80px_120px_rgba(0,0,0,0.08)] dark:hover:shadow-primary-900/10 ${isExpanded ? 'border-primary-500 dark:border-primary-900 shadow-2xl ring-[12px] ring-primary-50 dark:ring-primary-900/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                       >
                          <div onClick={() => toggleMatrixExpand(item.id)} className="p-10 lg:p-14 cursor-pointer group flex flex-col xl:flex-row xl:items-center gap-10 xl:gap-16">
                             <div className={`p-6 rounded-[35px] transition-all duration-700 ${isExpanded ? 'bg-primary-600 text-white shadow-2xl scale-110' : 'bg-slate-900 dark:bg-slate-800 text-white group-hover:bg-primary-600 group-hover:-translate-y-2 group-hover:shadow-2xl'}`}>
                                <FileText size={42} strokeWidth={2.5} />
                             </div>

                             <div className="flex-grow space-y-3">
                                <h4 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter">{item.title}</h4>
                                <p className="text-sm lg:text-base text-slate-400 dark:text-slate-500 font-bold max-w-2xl italic leading-relaxed opacity-80 border-l-4 border-slate-100 dark:border-slate-800 pl-6">{item.description}</p>
                                <div className="flex flex-wrap items-center gap-6 lg:gap-10 pt-4">
                                   <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
                                      <Clock size={16} strokeWidth={2.5} />
                                      <span>DEADLINE: {item.dueDate}</span>
                                   </div>
                                   <div className="flex items-center space-x-3 text-[10px] font-black text-primary-500 uppercase tracking-widest bg-primary-50 dark:bg-primary-950/40 px-5 py-2.5 rounded-2xl border border-primary-100 dark:border-primary-900/40 shadow-sm">
                                      <ExternalLink size={16} strokeWidth={2.5} />
                                      <a href={item.driveLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:underline">Reference Resource</a>
                                   </div>
                                </div>
                             </div>

                             <div className="w-full xl:w-80 space-y-4">
                                <div className="flex items-center justify-between text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-2 opacity-80">
                                   <span className="opacity-60 italic">Outcome Density</span>
                                   <span className="px-3 py-1 bg-primary-900 dark:bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-900/20 tabular-nums">{progress.count} / {progress.total}</span>
                                </div>
                                <ProgressBar progress={progress.percent} height="h-3.5" />
                             </div>
                             
                             <div className="self-center hidden xl:block">
                                <div className={`p-4 rounded-full border-2 transition-all duration-700 ${isExpanded ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800 text-primary-600 rotate-180' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-300 group-hover:bg-slate-900 dark:group-hover:bg-white dark:group-hover:text-slate-900 group-hover:text-white'}`}>
                                   <ChevronDown size={28} strokeWidth={2.5} />
                                </div>
                             </div>
                          </div>

                          <AnimatePresence>
                             {isExpanded && (
                               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.8 }} className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20">
                                  <div className="p-10 lg:p-14 pt-0 overflow-x-auto">
                                     <table className="w-full text-left">
                                        <thead>
                                           <tr className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] border-b-2 border-slate-100 dark:border-slate-800">
                                              <th className="px-8 py-8">Identity Module</th>
                                              <th className="px-8 py-8">Sync Email</th>
                                              <th className="px-8 py-8">Verification Payload</th>
                                              <th className="px-8 py-8 text-right">Operations</th>
                                           </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                           {assignmentSubmissions[item.id]?.map((student, idx) => (
                                             <tr key={idx} className="hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-500 group">
                                                <td className="px-8 py-8">
                                                   <div className="flex items-center space-x-4">
                                                      <div className="w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[18px] flex items-center justify-center font-black text-xs shadow-xl ring-2 ring-white dark:ring-slate-800 transition-all group-hover:scale-110">
                                                         {student.name.split(' ').map(n=>n[0]).join('')}
                                                      </div>
                                                      <span className="text-sm lg:text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter">{student.name}</span>
                                                   </div>
                                                </td>
                                                <td className="px-8 py-8 text-[11px] lg:text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60 underline underline-offset-8 decoration-slate-200 dark:decoration-slate-700">{student.email}</td>
                                                <td className="px-8 py-8">
                                                   <span className={`inline-flex items-center space-x-2.5 px-5 py-2 text-[10px] font-black rounded-xl border-2 uppercase tracking-widest ${student.status === 'submitted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 border-rose-100 dark:border-rose-800'}`}>
                                                      {student.status === 'submitted' ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <div className="w-4 h-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />}
                                                      <span>{student.status.replace('_', ' ')}</span>
                                                   </span>
                                                </td>
                                                <td className="px-8 py-8 text-right">
                                                   <button className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 transition-all hover:shadow-lg shadow-sm">
                                                      <MoreHorizontal size={22} strokeWidth={2.5} />
                                                   </button>
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

                {filteredAssignments.length === 0 && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-32 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[60px] shadow-sm">
                      <Database size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-8" />
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white font-outfit uppercase tracking-tighter">Query Empty</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 uppercase tracking-widest opacity-60">Your filters returned no synchronized curriculum nodes.</p>
                      <button onClick={() => {setSearchQuery(''); setFilterType('all')}} className="mt-12 text-primary-500 font-black text-[11px] uppercase tracking-widest hover:underline">Clear Matrix Filters</button>
                   </motion.div>
                )}
             </motion.div>
          </div>
        </div>
      </main>

      <CreateAssignmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handlePostDistribution}
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
