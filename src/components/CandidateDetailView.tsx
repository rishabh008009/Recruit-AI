import { useEffect } from 'react';
import { X, Mail, Calendar, Briefcase } from 'lucide-react';
import { Candidate } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { AutoPilotActions } from './AutoPilotActions';
import { formatDate } from '../utils/formatters';

interface CandidateDetailViewProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateDetailView({ candidate, isOpen, onClose }: CandidateDetailViewProps) {
  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!candidate) return null;

  const handleActionComplete = (action: 'interview' | 'rejection') => {
    console.log(`Action completed: ${action} for ${candidate.name}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-view-title"
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200 flex items-start justify-between">
            <div>
              <h2 id="detail-view-title" className="text-xl font-semibold text-neutral-900">
                {candidate.name}
              </h2>
              <p className="text-neutral-600 mt-1">{candidate.roleApplied}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-6">
            {/* Candidate Info */}
            <div className="flex items-center gap-4 mb-6">
              <ScoreBadge score={candidate.aiFitScore} />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                candidate.status === 'New' ? 'bg-blue-100 text-blue-800' :
                candidate.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                'bg-neutral-100 text-neutral-600'
              }`}>
                {candidate.status}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Mail className="w-4 h-4" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Calendar className="w-4 h-4" />
                <span>Applied {formatDate(candidate.appliedDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Briefcase className="w-4 h-4" />
                <span>{candidate.roleApplied}</span>
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                AI Analysis
              </h3>
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {candidate.aiAnalysis}
                </p>
              </div>
            </div>

            {/* Auto-Pilot Actions */}
            <AutoPilotActions 
              candidate={candidate} 
              onActionComplete={handleActionComplete}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CandidateDetailView;
