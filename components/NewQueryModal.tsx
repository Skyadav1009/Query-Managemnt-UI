import React, { useState } from 'react';
import { X, Sparkles, Loader2, Send } from 'lucide-react';
import { Teacher, UrgencyLevel, QueryStatus } from '../types';
import { analyzeQueryDraft, AIAnalysisResult } from '../services/geminiService';

interface NewQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  teachers: Teacher[];
}

export const NewQueryModal: React.FC<NewQueryModalProps> = ({ isOpen, onClose, onSubmit, teachers }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!title || !description) return;
    setIsAnalyzing(true);
    const result = await analyzeQueryDraft(title, description);
    setAnalysis(result);
    setIsAnalyzing(false);
    setStep(2);
  };

  const handleFinalSubmit = () => {
    // If user accepts AI refinement, use that, otherwise use original
    const finalDesc = analysis?.refinedDescription || description;
    const finalSubject = analysis?.suggestedSubject || 'General';
    const finalUrgency = analysis?.urgencyAssessment as UrgencyLevel || UrgencyLevel.MEDIUM;

    onSubmit({
      title,
      description: finalDesc,
      teacherId: selectedTeacher,
      subject: finalSubject,
      urgency: finalUrgency,
      status: QueryStatus.PENDING,
      dateSubmitted: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedTeacher('');
    setAnalysis(null);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">
            {step === 1 ? 'New Query' : 'Review & Submit'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Grade correction for Quiz 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-32 resize-none"
                  placeholder="Describe your issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Teacher</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                  <option value="">Select a teacher...</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-2 text-indigo-800 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  AI Analysis
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                     <span className="text-slate-600">Predicted Subject:</span>
                     <span className="font-medium text-slate-900">{analysis?.suggestedSubject}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-600">Urgency Level:</span>
                     <span className={`font-medium ${analysis?.urgencyAssessment === 'High' ? 'text-red-600' : 'text-slate-900'}`}>
                       {analysis?.urgencyAssessment}
                     </span>
                  </div>
                   <div className="flex justify-between">
                     <span className="text-slate-600">Clarity Score:</span>
                     <div className="flex items-center gap-2">
                       <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${(analysis?.clarityScore || 0) * 10}%` }}></div>
                       </div>
                       <span className="font-medium text-slate-900">{analysis?.clarityScore}/10</span>
                     </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Refined Description (Recommended)</label>
                <div className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm leading-relaxed">
                  {analysis?.refinedDescription}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  *The AI has polished your description for better clarity.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          {step === 1 ? (
             <button
              onClick={handleAnalyze}
              disabled={!title || !description || !selectedTeacher || isAnalyzing}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-all ${
                !title || !description || !selectedTeacher || isAnalyzing
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isAnalyzing ? 'Analyzing...' : 'Next: AI Review'}
            </button>
          ) : (
             <>
               <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors"
               >
                 Back
               </button>
               <button
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
               >
                 <Send className="w-4 h-4" />
                 Submit Query
               </button>
             </>
          )}
        </div>
      </div>
    </div>
  );
};