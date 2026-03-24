import React from 'react';
import { ShieldCheck, User } from 'lucide-react';

/**
 * Platform Identity Badge.
 * High-contrast indicator of session authority level.
 */
const RoleBadge = ({ role }) => {
  const isAdmin = role === 'admin';
  
  const badgeClasses = isAdmin 
    ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
    : 'bg-primary-50 text-primary-700 border-primary-100';

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${badgeClasses}`}>
      {isAdmin ? <ShieldCheck size={14} strokeWidth={2.5} /> : <User size={14} strokeWidth={2.5} />}
      <span>{role} VECTOR</span>
    </div>
  );
};

export default RoleBadge;
