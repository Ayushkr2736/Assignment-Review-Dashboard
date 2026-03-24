// Initial seed data if storage is empty
export const initialAssignments = [
  {
    id: 'A1',
    title: 'Advanced React Patterns',
    description: 'Deep dive into HOCs, Render Props, and Custom Hooks.',
    dueDate: '2024-04-10',
    driveLink: 'https://drive.google.com/sample1',
    createdBy: 'ADM001'
  },
  {
    id: 'A2',
    title: 'Database Normalization',
    description: 'Applying 1NF, 2NF, and 3NF to a sample e-commerce schema.',
    dueDate: '2024-04-15',
    driveLink: 'https://drive.google.com/sample2',
    createdBy: 'ADM001'
  },
  {
    id: 'A3',
    title: 'PostgreSQL Query Optimization',
    description: 'Learn how to use EXPLAIN ANALYZE and Indexing effectively.',
    dueDate: '2024-04-20',
    driveLink: 'https://drive.google.com/sample3',
    createdBy: 'ADM002'
  }
];

export const initialSubmissions = [
  {
    assignmentId: 'A1',
    studentId: 'STU001',
    status: 'submitted',
    submissionLink: 'https://github.com/student1/react-patterns'
  },
  {
    assignmentId: 'A2',
    studentId: 'STU001',
    status: 'not_submitted',
    submissionLink: ''
  }
];

export const initialStudents = [
  { id: 'STU001', name: 'Ayush Kumar', email: 'ayush@learn.com' },
  { id: 'STU002', name: 'Sarah Miller', email: 'sarah.m@edu.com' },
  { id: 'STU003', name: 'David Chen', email: 'd.chen@dev.io' },
  { id: 'STU004', name: 'Alice Wong', email: 'aw@cloud.org' },
  { id: 'STU005', name: 'Mark Wilson', email: 'wilson@corp.com' }
];
