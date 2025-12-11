import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-card p-6 border border-neutral-200"
      role="region"
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-neutral-900" aria-live="polite">{value}</p>
        </div>
        <div className="p-3 bg-primary-50 rounded-lg" aria-hidden="true">
          <div className="text-primary-600">{icon}</div>
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
