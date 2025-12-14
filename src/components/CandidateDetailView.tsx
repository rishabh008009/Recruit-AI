import { useEffect, useState } from 'react';
import { X, Mail, Calendar, Briefcase, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { Candidate } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { AutoPilotActions } from './AutoPilotActions';
import { formatDate } from '../utils/formatters';

interface CandidateDetailViewProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (candidateId: string) => void;
}

function getScoreInsight(score: number): { icon: React.ReactNode; text: string; color: string } {
  if (score > 80) {
    return {
      icon: <CheckCircle className="w-5 h-5" />,
      text: 'Strong Match - Recommended for Interview',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    };
  } else if (score >= 50) {
    return {
      icon: <TrendingUp className="w-5 h-5" />,
      text: 'Moderate Match - Review Recommended',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    };
  } else {
    return {
      icon: <AlertTriangle className="w-5 h-5" />,
      text: 'Low Match - May Not Meet Requirements',
      color: 'text-red-600 bg-red-50 border-red-200',
    };
  }
}

export function CandidateDetailView({ candidate, isOpen, onClose, onDelete }: CandidateDetailViewProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, showDeleteConfirm]);

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

  // Reset delete confirm when panel closes
  useEffect(() => {
    if (!isOpen) {
      setShowDeleteConfirm(false);
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!candidate) return null;

  const handleActionComplete = (action: 'interview' | 'rejection') => {
    console.log(`Action completed: ${action} for ${candidate.name}`);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(candidate.id);
      onClose();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setIsDeleting(false);
    }
  };

  const insight = getScoreInsight(candidate.aiFitScore);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-view-title"
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Header with gradient */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 px-6 py-6">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl" />
            </div>
            
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
                  {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 id="detail-view-title" className="text-xl font-bold text-white">
                    {candidate.name}
                  </h2>
                  <p className="text-purple-200 mt-0.5">{candidate.roleApplied}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-white/70 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Delete candidate"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <p className="text-red-800 font-medium mb-3">
                Are you sure you want to delete {candidate.name}?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 px-6 py-6">
            {/* Score Section */}
            <div className="flex items-center gap-4 mb-6">
              <ScoreBadge score={candidate.aiFitScore} showRing />
              <div className="flex-1">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${insight.color}`}>
                  {insight.icon}
                  <span className="text-sm font-medium">{insight.text}</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                candidate.status === 'New' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                candidate.status === 'Interview' ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white' :
                'bg-neutral-200 text-neutral-600'
              }`}>
                {candidate.status}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-neutral-700">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                </div>
                <span className="text-sm text-neutral-700">Applied {formatDate(candidate.appliedDate)}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Briefcase className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm text-neutral-700">{candidate.roleApplied}</span>
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">AI Analysis</h3>
              </div>
              <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
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
