export enum QueryStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected'
}

export enum UrgencyLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Teacher {
  id: string;
  name: string;
  department: string;
  avatar: string;
}

export interface Query {
  id: string;
  title: string;
  description: string;
  subject: string;
  teacherId: string;
  status: QueryStatus;
  urgency: UrgencyLevel;
  dateSubmitted: string; // ISO String
  lastUpdated: string; // ISO String
  teacherResponse?: string;
  aiAnalysis?: string; // Metadata from Gemini
}

export interface User {
  id: string;
  name: string;
  studentId: string;
  avatar: string;
}

export type ViewState = 'DASHBOARD' | 'MY_QUERIES' | 'PROFILE';