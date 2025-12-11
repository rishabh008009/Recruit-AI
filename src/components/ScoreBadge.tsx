interface ScoreBadgeProps {
  score: number;
}

/**
 * Determines the color classes based on the AI Fit Score
 * - Green: score > 80
 * - Yellow: score 50-79
 * - Red: score < 50
 */
function getScoreColorClasses(score: number): string {
  if (score > 80) {
    return 'bg-green-100 text-green-800';
  } else if (score >= 50) {
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-red-100 text-red-800';
  }
}

function getScoreLabel(score: number): string {
  if (score > 80) return 'High match';
  if (score >= 50) return 'Moderate match';
  return 'Low match';
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const colorClasses = getScoreColorClasses(score);
  const label = getScoreLabel(score);
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${colorClasses}`}
      role="status"
      aria-label={`AI Fit Score: ${score}% - ${label}`}
    >
      {score}%
    </span>
  );
}

export default ScoreBadge;
