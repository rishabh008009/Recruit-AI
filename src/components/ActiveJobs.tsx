import { Briefcase, Users } from 'lucide-react';
import { Job } from '../types';

interface ActiveJobsProps {
  jobs: Job[];
}

export function ActiveJobs({ jobs }: ActiveJobsProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-8 mb-8">
        <div className="text-center text-neutral-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-lg font-medium">No Active Jobs</p>
          <p className="text-sm">Create a new job posting to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Jobs</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex-shrink-0 bg-white rounded-lg shadow-card border border-neutral-200 p-4 min-w-[280px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900">{job.title}</h3>
                <p className="text-sm text-neutral-500">{job.department}</p>
              </div>
              <div className="p-2 bg-primary-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-neutral-600">
                <span className="font-medium">{job.openings}</span>
                <span>openings</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-600">
                <Users className="w-4 h-4" />
                <span className="font-medium">{job.applicants}</span>
                <span>applicants</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveJobs;
