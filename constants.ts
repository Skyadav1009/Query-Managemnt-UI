import { Query, QueryStatus, Teacher, UrgencyLevel, User } from './types';

export const CURRENT_USER: User = {
  id: 'u-123',
  name: 'Alex Johnson',
  studentId: 'ST-2024-889',
  avatar: 'https://picsum.photos/200/200?random=1'
};

export const MOCK_TEACHERS: Teacher[] = [
  { id: 't-1', name: 'Dr. Emily Carter', department: 'Computer Science', avatar: 'https://picsum.photos/200/200?random=2' },
  { id: 't-2', name: 'Prof. Alan Grant', department: 'Mathematics', avatar: 'https://picsum.photos/200/200?random=3' },
  { id: 't-3', name: 'Mrs. Sarah Connor', department: 'Administration', avatar: 'https://picsum.photos/200/200?random=4' },
];

export const MOCK_QUERIES: Query[] = [
  {
    id: 'q-1',
    title: 'Grade Discrepancy in Calculus II',
    description: 'I noticed my midterm grade is listed as 75, but my paper says 85. Can you please check?',
    subject: 'Calculus II',
    teacherId: 't-2',
    status: QueryStatus.IN_PROGRESS,
    urgency: UrgencyLevel.HIGH,
    dateSubmitted: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    lastUpdated: new Date(Date.now() - 86400000).toISOString(),
    teacherResponse: 'I am looking into your paper records now. Will update shortly.'
  },
  {
    id: 'q-2',
    title: 'Request for Extension - CS101 Project',
    description: 'I have been unwell for the past 3 days. Attached is my medical certificate. Can I get a 2-day extension?',
    subject: 'Computer Science 101',
    teacherId: 't-1',
    status: QueryStatus.RESOLVED,
    urgency: UrgencyLevel.MEDIUM,
    dateSubmitted: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    lastUpdated: new Date(Date.now() - 518400000).toISOString(),
    teacherResponse: 'Extension granted. New deadline is Friday.'
  },
  {
    id: 'q-3',
    title: 'Dormitory WiFi Issues',
    description: 'The WiFi in Block B has been down since yesterday evening.',
    subject: 'Facilities',
    teacherId: 't-3',
    status: QueryStatus.PENDING,
    urgency: UrgencyLevel.LOW,
    dateSubmitted: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
  }
];