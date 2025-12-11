import { useMemo } from 'react';
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
      return 'bg-blue-100 text-blue-800';
    case 'Interview':
      return 'bg-purple-100 text-purple-800';
    case 'Rejected':
      return 'bg-neutral-100 text-neutral-600';
    default:
      return 'bg-neutral-100 text-neutral-600';
  }
}

export function CandidateTable({ candidates, onCandidateClick }: CandidateTableProps) {
  // Sort candidates by appliedDate in descending order (most recent first)
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => 
      b.appliedDate.getTime() - a.appliedDate.getTime()
    );
  }, [candidates]);

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-8" role="status">
        <div className="text-center text-neutral-500">
          <p className="text-lg font-medium">No Candidates Yet</p>
          <p className="text-sm">Candidates will appear here once they apply.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-card border border-neutral-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900" id="candidates-table-heading">Candidates</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" aria-labelledby="candidates-table-heading">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Role Applied
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                AI Fit Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {sortedCandidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="hover:bg-neutral-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onCandidateClick(candidate)}
                    className="text-primary-600 hover:text-primary-700 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                  >
                    {candidate.name}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-neutral-700">
                  {candidate.roleApplied}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                  {formatDate(candidate.appliedDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(candidate.status)}`}
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
