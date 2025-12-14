import { useMemo } from 'react';
import { Users } from 'lucide-react';
import { Candidate, CandidateStatus } from '../types';
import { ScoreBadge } from './ScoreBadge';
import { formatDate } from '../utils/formatters';

interface CandidateTableProps {
  candidates: Candidate[];
  onCandidateClick: (candidate: Candidate) => void;
}

function getStatusBadgeClasses(status: CandidateStatus): string {
  switch (status) {
    case 'New':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    case 'Interview':
      return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white';
    case 'Rejected':
      return 'bg-neutral-200 text-neutral-600';
    default:
      return 'bg-neutral-200 text-neutral-600';
  }
}

export function CandidateTable({ candidates, onCandidateClick }: CandidateTableProps) {
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => 
      b.appliedDate.getTime() - a.appliedDate.getTime()
    );
  }, [candidates]);

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-12" role="status">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg font-semibold text-neutral-900">No Candidates Yet</p>
          <p className="text-sm text-neutral-500 mt-1">Candidates will appear here once they apply.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-neutral-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900" id="candidates-table-heading">
              Candidates Pipeline
            </h2>
            <p className="text-sm text-neutral-500">{candidates.length} total candidates</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" aria-labelledby="candidates-table-heading">
          <thead>
            <tr className="bg-neutral-50/50">
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Role Applied
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                AI Fit Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {sortedCandidates.map((candidate, index) => (
              <tr
                key={candidate.id}
                className="hover:bg-purple-50/50 transition-colors duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onCandidateClick(candidate)}
                    className="flex items-center gap-3 group/btn"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover/btn:shadow-lg transition-shadow">
                      {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-neutral-900 group-hover/btn:text-purple-600 transition-colors">
                        {candidate.name}
                      </p>
                      <p className="text-xs text-neutral-500">{candidate.email}</p>
                    </div>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-neutral-700 font-medium">{candidate.roleApplied}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-neutral-500">{formatDate(candidate.appliedDate)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusBadgeClasses(candidate.status)}`}
                  >
                    {candidate.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ScoreBadge score={candidate.aiFitScore} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CandidateTable;
