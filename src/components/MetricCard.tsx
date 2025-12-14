import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient?: 'purple' | 'cyan' | 'pink' | 'orange';
}

const gradientClasses = {
  purple: 'from-purple-500 to-violet-600',
  cyan: 'from-cyan-500 to-blue-600',
  pink: 'from-pink-500 to-rose-600',
  orange: 'from-orange-500 to-amber-600',
};

const iconBgClasses = {
  purple: 'bg-purple-100 text-purple-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  pink: 'bg-pink-100 text-pink-600',
  orange: 'bg-orange-100 text-orange-600',
};

export function MetricCard({ title, value, icon, gradient = 'purple' }: MetricCardProps) {
  return (
    <div 
      className="relative overflow-hidden bg-white rounded-2xl shadow-card p-6 border border-neutral-100 card-hover group"
      role="region"
      aria-label={`${title}: ${value}`}
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientClasses[gradient]}`} />
      
      {/* Hover glow effect */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradientClasses[gradient]} rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`} />
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent" aria-live="polite">
            {value}
          </p>
        </div>
        <div className={`p-4 rounded-2xl ${iconBgClasses[gradient]} transition-transform duration-300 group-hover:scale-110`} aria-hidden="true">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
