import { Users, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { DashboardMetrics } from '../types';
import { MetricCard } from './MetricCard';
import { formatTimeSaved } from '../utils/formatters';

interface CommandCenterProps {
  metrics: DashboardMetrics;
}

export function CommandCenter({ metrics }: CommandCenterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Candidates Processed"
        value={metrics.candidatesProcessed}
        icon={<Users className="w-6 h-6" />}
        gradient="purple"
      />
      <MetricCard
        title="Interviews Scheduled"
        value={metrics.interviewsScheduled}
        icon={<TrendingUp className="w-6 h-6" />}
        gradient="cyan"
      />
      <MetricCard
        title="Time Saved"
        value={formatTimeSaved(metrics.timeSaved)}
        icon={<Clock className="w-6 h-6" />}
        gradient="orange"
      />
      <MetricCard
        title="Pending Review"
        value={metrics.pendingReview}
        icon={<AlertCircle className="w-6 h-6" />}
        gradient="pink"
      />
    </div>
  );
}

export default CommandCenter;
