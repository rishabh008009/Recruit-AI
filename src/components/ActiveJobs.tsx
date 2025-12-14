import { Briefcase, Users, MapPin, Clock } from 'lucide-react';
import { Job } from '../types';

interface ActiveJobsProps {
  jobs: Job[];
}

export function ActiveJobs({ jobs }: ActiveJobsProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-12 mb-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-2xl mb-4">
            <Briefcase className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg font-semibold text-neutral-900">No Active Jobs</p>
          <p className="text-sm text-neutral-500 mt-1">Create a new job posting to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-xl">
          <Briefcase className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900">Active Jobs</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="flex-shrink-0 bg-white rounded-2xl shadow-card border border-neutral-100 p-5 min-w-[300px] card-hover group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 group-hover:text-purple-700 transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-neutral-500 mt-0.5">{job.department}</p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl group-hover:from-purple-200 group-hover:to-violet-200 transition-colors">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            
            {/* Location & Type */}
            <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Remote</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Full-time</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{job.openings}</p>
                  <p className="text-xs text-neutral-500">Openings</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-cyan-600">{job.applicants}</p>
                  <p className="text-xs text-neutral-500">Applicants</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-purple-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveJobs;
