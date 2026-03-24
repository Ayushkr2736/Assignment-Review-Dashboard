import { initialAssignments, initialSubmissions, initialStudents } from '../data/mockData';

// Storage keys
const ASSIGNMENTS_KEY = 'learnflow_assignments';
const SUBMISSIONS_KEY = 'learnflow_submissions';
const STUDENTS_KEY = 'learnflow_students';

// Helper to get data from localStorage or fallback to seed
const getData = (key, fallback) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error(`Failed to parse ${key}`, err);
    return fallback;
  }
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Assignment Services ---

/**
 * Fetch all assignments for a student, merging submission status.
 * @param {string} studentId 
 */
export const getAssignmentsByStudent = (studentId) => {
  const assignments = getData(ASSIGNMENTS_KEY, initialAssignments);
  const submissions = getData(SUBMISSIONS_KEY, initialSubmissions);

  return assignments.map(assignment => {
    const submission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === studentId);
    return {
      ...assignment,
      status: submission ? submission.status : 'not_submitted',
      submissionLink: submission ? submission.submissionLink : ''
    };
  });
};

/**
 * Fetch all assignments created by a specific admin.
 * @param {string} adminId 
 */
export const getAssignmentsByAdmin = (adminId) => {
  const assignments = getData(ASSIGNMENTS_KEY, initialAssignments);
  return assignments.filter(a => a.createdBy === adminId);
};

/**
 * Create a new assignment.
 * @param {object} assignmentData 
 */
export const createAssignment = (assignmentData) => {
  const assignments = getData(ASSIGNMENTS_KEY, initialAssignments);
  const newAssignment = {
    ...assignmentData,
    id: `A${Date.now()}`, // Generated ID
  };

  const updatedAssignments = [newAssignment, ...assignments];
  saveData(ASSIGNMENTS_KEY, updatedAssignments);
  return newAssignment;
};

/**
 * Submit an assignment for a student.
 * @param {string} assignmentId 
 * @param {string} studentId 
 * @param {string} submissionLink 
 */
export const submitAssignment = (assignmentId, studentId, submissionLink) => {
  const submissions = getData(SUBMISSIONS_KEY, initialSubmissions);
  
  const existingIndex = submissions.findIndex(s => s.assignmentId === assignmentId && s.studentId === studentId);
  
  const newSubmission = {
    assignmentId,
    studentId,
    submissionLink,
    status: 'submitted',
    submittedAt: new Date().toISOString()
  };

  let updatedSubmissions;
  if (existingIndex !== -1) {
    updatedSubmissions = [...submissions];
    updatedSubmissions[existingIndex] = newSubmission;
  } else {
    updatedSubmissions = [...submissions, newSubmission];
  }

  saveData(SUBMISSIONS_KEY, updatedSubmissions);
  return newSubmission;
};

/**
 * Get all students and their submission status for a specific assignment.
 * @param {string} assignmentId 
 */
export const getStudentsByAssignment = (assignmentId) => {
  const students = getData(STUDENTS_KEY, initialStudents);
  const submissions = getData(SUBMISSIONS_KEY, initialSubmissions);

  return students.map(student => {
    const submission = submissions.find(s => s.assignmentId === assignmentId && s.studentId === student.id);
    return {
      ...student,
      status: submission ? submission.status : 'not_submitted',
      submissionLink: submission ? submission.submissionLink : ''
    };
  });
};

// Initialize if requested
export const initializeStorage = () => {
  getData(ASSIGNMENTS_KEY, initialAssignments);
  getData(SUBMISSIONS_KEY, initialSubmissions);
  getData(STUDENTS_KEY, initialStudents);
};
