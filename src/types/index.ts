export type CandidateStatus = 'New' | 'Interview' | 'Rejected';

export interface Candidate {
  id: string;
  name: string;
  roleApplied: string;
  appliedDate: Date;
  status: CandidateStatus;
  aiFitScore: number;
  email: string;
  aiAnalysis: string;
  resumeUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  openings: number;
  applicants: number;
  description?: string;
}

export interface DashboardMetrics {
  candidatesProcessed: number;
  timeSaved: number;
  pendingReview: number;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}
