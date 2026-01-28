import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquarePlus, 
  Search, 
  Bell, 
  Menu,
  X,
  Plus,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { 
  MOCK_QUERIES, 
  MOCK_TEACHERS, 
  CURRENT_USER 
} from './constants';
import { 
  Query, 
  QueryStatus, 
  Teacher, 
  User, 
  ViewState 
} from './types';
import { StatsCard } from './components/StatsCard';
import { QueryList } from './components/QueryList';
import { NewQueryModal } from './components/NewQueryModal';

const App: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>(MOCK_QUERIES);
  const [viewState, setViewState] = useState<ViewState>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewQueryModalOpen, setIsNewQueryModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  // Derived Stats
  const totalQueries = queries.length;
  const pendingQueries = queries.filter(q => q.status === QueryStatus.PENDING).length;
  const resolvedQueries = queries.filter(q => q.status === QueryStatus.RESOLVED).length;

  const handleCreateQuery = (newQueryData: any) => {
    const newQuery: Query = {
      id: `q-${Date.now()}`,
      ...newQueryData
    };
    
    // Optimistic update
    setQueries([newQuery, ...queries]);
    
    // Simulate teacher response (AI simulation or just delay)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        setQueries(prev => prev.map(q => 
          q.id === newQuery.id 
          ? { 
              ...q, 
              status: QueryStatus.IN_PROGRESS, 
              lastUpdated: new Date().toISOString(),
              teacherResponse: "Received. I will review this shortly." 
            }
          : q
        ));
      }, 5000); // 5 seconds delay for "real-time" feel
    }
  };

  const filteredQueries = queries.filter(q => 
    (statusFilter === 'All' || q.status === statusFilter) &&
    (q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     q.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="bg-indigo-600 p-2 rounded-lg">
               <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">EduQuery</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button 
              onClick={() => { setViewState('DASHBOARD'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${viewState === 'DASHBOARD' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => { setViewState('MY_QUERIES'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${viewState === 'MY_QUERIES' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <MessageSquarePlus className="w-5 h-5" />
              My Queries
              {pendingQueries > 0 && <span className="ml-auto bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs">{pendingQueries}</span>}
            </button>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3">
              <img src={CURRENT_USER.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{CURRENT_USER.name}</p>
                <p className="text-xs text-slate-500 truncate">{CURRENT_USER.studentId}</p>
              </div>
              <LogOut className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {viewState === 'DASHBOARD' ? 'Dashboard Overview' : 'Query Management'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsNewQueryModalOpen(true)}
               className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
             >
               <Plus className="w-4 h-4" />
               New Query
             </button>
             <button className="relative p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Stats Section */}
            {viewState === 'DASHBOARD' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard 
                  title="Total Queries" 
                  value={totalQueries} 
                  icon={MessageSquarePlus} 
                  colorClass="bg-indigo-500" 
                  trend="+2 this week"
                />
                <StatsCard 
                  title="Pending Action" 
                  value={pendingQueries} 
                  icon={Bell} 
                  colorClass="bg-amber-500" 
                />
                <StatsCard 
                  title="Resolved" 
                  value={resolvedQueries} 
                  icon={GraduationCap} 
                  colorClass="bg-emerald-500" 
                />
              </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by title or subject..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {['All', QueryStatus.PENDING, QueryStatus.IN_PROGRESS, QueryStatus.RESOLVED].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap
                      ${statusFilter === status 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Query List */}
            <div>
               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                 Recent Queries
               </h3>
               <QueryList 
                 queries={filteredQueries} 
                 teachers={MOCK_TEACHERS}
                 statusFilter={statusFilter}
                 onSelectQuery={setSelectedQuery}
               />
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={() => setIsNewQueryModalOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* New Query Modal */}
      <NewQueryModal 
        isOpen={isNewQueryModalOpen}
        onClose={() => setIsNewQueryModalOpen(false)}
        onSubmit={handleCreateQuery}
        teachers={MOCK_TEACHERS}
      />

      {/* Query Detail Modal (Quick implementation inline for simplicity) */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50">
              <div>
                 <h2 className="text-xl font-bold text-slate-900">{selectedQuery.title}</h2>
                 <p className="text-sm text-slate-500 mt-1">{selectedQuery.subject} • Submitted on {new Date(selectedQuery.dateSubmitted).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelectedQuery(null)} className="p-1 hover:bg-slate-200 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-xl flex items-center gap-3 border ${
                selectedQuery.status === QueryStatus.RESOLVED ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                selectedQuery.status === QueryStatus.REJECTED ? 'bg-red-50 border-red-100 text-red-800' :
                'bg-blue-50 border-blue-100 text-blue-800'
              }`}>
                <div className="flex-1">
                  <p className="font-semibold text-sm uppercase tracking-wide opacity-80">Current Status</p>
                  <p className="font-bold text-lg">{selectedQuery.status}</p>
                </div>
                {/* Timeline dot simulation */}
                <div className="text-right text-xs opacity-75">
                  Last updated:<br/>
                  {new Date(selectedQuery.lastUpdated).toLocaleString()}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 mb-2">Description</h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedQuery.description}
                </p>
              </div>

              {/* Assigned Teacher */}
              <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                 <img 
                   src={MOCK_TEACHERS.find(t => t.id === selectedQuery.teacherId)?.avatar} 
                   className="w-12 h-12 rounded-full object-cover" 
                   alt="Teacher"
                 />
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-semibold">Assigned Faculty</p>
                   <p className="font-medium text-slate-900">{MOCK_TEACHERS.find(t => t.id === selectedQuery.teacherId)?.name}</p>
                   <p className="text-xs text-slate-500">{MOCK_TEACHERS.find(t => t.id === selectedQuery.teacherId)?.department}</p>
                 </div>
              </div>

              {/* Teacher Response */}
              {selectedQuery.teacherResponse ? (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2">Faculty Response</h4>
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl relative">
                    <div className="absolute top-4 left-4 w-1 h-full bg-indigo-500 rounded-full opacity-20 h-[calc(100%-2rem)]"></div>
                    <p className="text-slate-800 pl-4 italic">
                      "{selectedQuery.teacherResponse}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p>No response yet from faculty.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button onClick={() => setSelectedQuery(null)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;