import { Users, Clock, AlertCircle } from 'lucide-react';
import { DashboardMetrics } from '../types';
import { MetricCard } from './MetricCard';
import { formatTimeSaved } from '../utils/formatters';

interface CommandCenterProps {
  metrics: DashboardMetrics;
}

export function CommandCenter({ metrics }: CommandCenterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Candidates Processed"
        value={metrics.candidatesProcessed}
        icon={<Users className="w-6 h-6" />}
      />
      <MetricCard
        title="Time Saved"
        value={formatTimeSaved(metrics.timeSaved)}
        icon={<Clock className="w-6 h-6" />}
      />
      <MetricCard
        title="Pending Review"
        value={metrics.pendingReview}
        icon={<AlertCircle className="w-6 h-6" />}
      />
    </div>
  );
}

export default CommandCenter;
