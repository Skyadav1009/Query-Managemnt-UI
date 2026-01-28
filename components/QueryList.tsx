import React from 'react';
import { Query, Teacher, QueryStatus, UrgencyLevel } from '../types';
import { Clock, CheckCircle2, AlertCircle, XCircle, ChevronRight, User as UserIcon } from 'lucide-react';

interface QueryListProps {
  queries: Query[];
  teachers: Teacher[];
  onSelectQuery: (query: Query) => void;
  statusFilter: string;
}

const getStatusColor = (status: QueryStatus) => {
  switch (status) {
    case QueryStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
    case QueryStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-700 border-blue-200';
    case QueryStatus.RESOLVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case QueryStatus.REJECTED: return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const getStatusIcon = (status: QueryStatus) => {
  switch (status) {
    case QueryStatus.PENDING: return Clock;
    case QueryStatus.IN_PROGRESS: return LoaderIcon;
    case QueryStatus.RESOLVED: return CheckCircle2;
    case QueryStatus.REJECTED: return XCircle;
    default: return Clock;
  }
};

// Simple loader icon component
const LoaderIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

export const QueryList: React.FC<QueryListProps> = ({ queries, teachers, onSelectQuery, statusFilter }) => {
  const filteredQueries = statusFilter === 'All'
    ? queries
    : queries.filter(q => q.status === statusFilter);

  const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || 'Unknown Teacher';
  const getTeacherAvatar = (id: string) => teachers.find(t => t.id === id)?.avatar;

  if (filteredQueries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No queries found</h3>
        <p className="text-slate-500">Try adjusting your filters or create a new query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredQueries.map((query) => {
        const StatusIcon = getStatusIcon(query.status);
        const avatarUrl = getTeacherAvatar(query.teacherId);
        
        return (
          <div 
            key={query.id}
            onClick={() => onSelectQuery(query)}
            className="group bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${getStatusColor(query.status)}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {query.status}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {new Date(query.dateSubmitted).toLocaleDateString()}
                </span>
                {query.urgency === UrgencyLevel.HIGH && (
                  <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> High Urgency
                  </span>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {query.title}
            </h3>
            
            <p className="text-slate-600 text-sm line-clamp-2 mb-4">
              {query.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-slate-500" />
                  </div>
                )}
                <span className="text-sm font-medium text-slate-600">
                  {getTeacherName(query.teacherId)}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-sm text-slate-500">{query.subject}</span>
              </div>
              
              {query.teacherResponse && (
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  Teacher Responded
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};