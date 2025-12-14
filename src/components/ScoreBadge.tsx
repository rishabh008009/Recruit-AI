interface ScoreBadgeProps {
  score: number;
  showRing?: boolean;
}

function getScoreGradient(score: number): string {
  if (score > 80) {
    return 'from-emerald-500 to-green-600';
  } else if (score >= 50) {
    return 'from-amber-500 to-orange-500';
  } else {
    return 'from-red-500 to-rose-600';
  }
}

function getScoreBgClasses(score: number): string {
  if (score > 80) {
    return 'bg-emerald-50 border-emerald-200';
  } else if (score >= 50) {
    return 'bg-amber-50 border-amber-200';
  } else {
    return 'bg-red-50 border-red-200';
  }
}

function getScoreTextColor(score: number): string {
  if (score > 80) return 'text-emerald-700';
  if (score >= 50) return 'text-amber-700';
  return 'text-red-700';
}

function getScoreLabel(score: number): string {
  if (score > 80) return 'High match';
  if (score >= 50) return 'Moderate';
  return 'Low match';
}

export function ScoreBadge({ score, showRing = false }: ScoreBadgeProps) {
  const gradient = getScoreGradient(score);
  const bgClasses = getScoreBgClasses(score);
  const textColor = getScoreTextColor(score);
  const label = getScoreLabel(score);
  
  if (showRing) {
    const circumference = 2 * Math.PI * 18;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-14 h-14 score-ring" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke={`url(#gradient-${score})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
          <defs>
            <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={score > 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'} />
              <stop offset="100%" stopColor={score > 80 ? '#059669' : score >= 50 ? '#f97316' : '#dc2626'} />
            </linearGradient>
          </defs>
        </svg>
        <span className={`absolute text-sm font-bold ${textColor}`}>{score}%</span>
      </div>
    );
  }
  
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${bgClasses}`}
      role="status"
      aria-label={`AI Fit Score: ${score}% - ${label}`}
    >
      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`} />
      <span className={`text-sm font-bold ${textColor}`}>{score}%</span>
    </div>
  );
}

export default ScoreBadge;
