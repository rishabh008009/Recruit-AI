import { Candidate, CandidateStatus } from '../types';

const VALID_STATUSES: CandidateStatus[] = ['New', 'Interview', 'Rejected'];

/**
 * Validates that an AI Fit Score is within the valid range (0-100)
 */
export function isValidScore(score: number): boolean {
  return typeof score === 'number' && score >= 0 && score <= 100;
}

/**
 * Validates that a status is one of the allowed values
 */
export function isValidStatus(status: string): status is CandidateStatus {
  return VALID_STATUSES.includes(status as CandidateStatus);
}

/**
 * Validates that a date is a valid Date object
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validates a candidate object has all required fields with valid values
 */
export function validateCandidate(candidate: unknown): candidate is Candidate {
  if (!candidate || typeof candidate !== 'object') {
    return false;
  }

  const c = candidate as Record<string, unknown>;

  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.roleApplied === 'string' &&
    isValidDate(c.appliedDate) &&
    typeof c.status === 'string' &&
    isValidStatus(c.status) &&
    typeof c.aiFitScore === 'number' &&
    isValidScore(c.aiFitScore) &&
    typeof c.email === 'string' &&
    typeof c.aiAnalysis === 'string'
  );
}

/**
 * Clamps a score to the valid range (0-100)
 */
export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}
