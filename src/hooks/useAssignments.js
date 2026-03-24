import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAssignmentsByAdmin, getStudentsByAssignment, createAssignment, getAssignmentsByStudent, submitAssignment } from '../utils/assignmentService';

export const useAdminAssignments = (adminId) => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    if (!adminId) return;

    try {
      const data = getAssignmentsByAdmin(adminId);
      setAssignments(data);
      
      const submissionsMap = {};
      data.forEach(assignment => {
        submissionsMap[assignment.id] = getStudentsByAssignment(assignment.id);
      });
      setSubmissions(submissionsMap);
      setError(null);
    } catch (err) {
      console.error('Failed to load admin assignments:', err);
      setError('Failed to load assignments. Please try again.');
    }
  }, [adminId]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate natural loading state
    const timer = setTimeout(() => {
      fetchData();
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const addAssignment = useCallback((formData) => {
    if (!adminId) return;
    try {
      createAssignment({ ...formData, createdBy: adminId });
      fetchData();
      return true;
    } catch (err) {
      console.error('Failed to create assignment:', err);
      return false;
    }
  }, [adminId, fetchData]);

  return {
    assignments,
    submissions,
    isLoading,
    error,
    addAssignment,
    refreshData: fetchData
  };
};

export const useStudentAssignments = (studentId) => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    if (!studentId) return;

    try {
      const data = getAssignmentsByStudent(studentId);
      // Sort tasks by due date
      const sortedData = [...data].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setAssignments(sortedData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch student assignments:', err);
      setError('Failed to load your assignments.');
    }
  }, [studentId]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      fetchData();
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const completeAssignment = useCallback((assignmentId, submissionUrl = 'https://drive.google.com/example') => {
    if (!studentId || !assignmentId) return;
    try {
      submitAssignment(assignmentId, studentId, submissionUrl);
      fetchData();
      return true;
    } catch (err) {
      console.error('Failed to submit assignment:', err);
      return false;
    }
  }, [studentId, fetchData]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'submitted').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, pending: total - completed, percentage };
  }, [assignments]);

  return {
    assignments,
    isLoading,
    error,
    stats,
    completeAssignment,
    refreshData: fetchData
  };
};
