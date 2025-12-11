import { Candidate, Job, DashboardMetrics } from '../types';

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Amit Sharma',
    roleApplied: 'Senior Product Manager',
    appliedDate: new Date('2024-01-15'),
    status: 'New',
    aiFitScore: 92,
    email: 'amit.sharma@email.com',
    aiAnalysis: 'Exceptional match for the Senior Product Manager role. Candidate demonstrates 8+ years of product leadership experience with a strong track record in B2B SaaS. Expertise in roadmap planning, stakeholder management, and data-driven decision making aligns perfectly with job requirements. Led 3 successful product launches generating $10M+ ARR. Strong technical background with engineering degree. Only minor gap: limited experience with healthcare domain, but transferable skills are excellent.',
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    roleApplied: 'Full Stack Engineer',
    appliedDate: new Date('2024-01-14'),
    status: 'New',
    aiFitScore: 78,
    email: 'sarah.jenkins@email.com',
    aiAnalysis: 'Strong candidate for Full Stack Engineer position. Solid 5 years of experience with React, Node.js, and PostgreSQL - all core requirements. Demonstrated ability to build scalable applications and work in agile teams. GitHub profile shows consistent contributions and clean code practices. Gap identified: No AWS certification or production cloud deployment experience mentioned. However, shows self-learning capability and could quickly acquire cloud skills with proper onboarding.',
  },
  {
    id: '3',
    name: 'Shubham Verma',
    roleApplied: 'Senior Product Manager',
    appliedDate: new Date('2024-01-13'),
    status: 'New',
    aiFitScore: 45,
    email: 'shubham.verma@email.com',
    aiAnalysis: 'Limited alignment with Senior Product Manager requirements. Candidate has 2 years of experience as Associate Product Manager, which falls short of the 5+ years required for senior role. Background is primarily in e-commerce consumer apps, lacking B2B or enterprise product experience. Resume shows good analytical skills and MBA from reputable institution, but insufficient evidence of strategic product leadership, P&L ownership, or cross-functional team management at scale. Better suited for mid-level PM roles.',
  },
  {
    id: '4',
    name: 'Emily Chen',
    roleApplied: 'Full Stack Engineer',
    appliedDate: new Date('2024-01-12'),
    status: 'Interview',
    aiFitScore: 88,
    email: 'emily.chen@email.com',
    aiAnalysis: 'Outstanding technical candidate for Full Stack Engineer role. 6 years of full-stack development with deep expertise in React, TypeScript, Node.js, and AWS. Previously worked at high-growth startups where she architected microservices handling 1M+ daily users. Strong system design skills and experience with CI/CD pipelines. Excellent communication skills based on technical blog posts. AWS Solutions Architect certified. Cultural fit appears strong based on values alignment. Highly recommended for interview.',
  },
  {
    id: '5',
    name: 'Michael Rodriguez',
    roleApplied: 'Senior Product Manager',
    appliedDate: new Date('2024-01-11'),
    status: 'Rejected',
    aiFitScore: 62,
    email: 'michael.rodriguez@email.com',
    aiAnalysis: 'Moderate fit for Senior Product Manager position. Candidate has relevant 6 years of product experience and meets the experience threshold. However, background is heavily focused on internal tools and operations products rather than customer-facing products. Limited evidence of market research, competitive analysis, or go-to-market strategy execution. Resume lacks quantifiable business impact metrics. Technical skills are adequate but not exceptional. Would be a better fit for internal product or platform PM roles rather than customer-facing senior PM position.',
  },
];

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Product Manager',
    department: 'Product',
    openings: 2,
    applicants: 45,
    description: 'We are looking for an experienced Senior Product Manager with 5+ years of experience in B2B SaaS products. The ideal candidate will have a strong track record in roadmap planning, stakeholder management, and data-driven decision making. Experience with enterprise software, P&L ownership, and cross-functional team leadership is required. Technical background preferred.',
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer',
    department: 'Engineering',
    openings: 3,
    applicants: 97,
    description: 'Seeking a Full Stack Engineer with expertise in React, TypeScript, Node.js, and PostgreSQL. Must have experience building scalable web applications and working in agile teams. AWS certification and cloud deployment experience is a plus. Strong system design skills and familiarity with CI/CD pipelines required.',
  },
];

export const mockMetrics: DashboardMetrics = {
  candidatesProcessed: 142,
  timeSaved: 28,
  pendingReview: 5,
};
