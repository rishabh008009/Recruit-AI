// Candidates Service - Supabase Database Operations
import { supabase } from './supabase';
import { Candidate } from '../types';

export interface CandidateDB {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role_applied: string;
  applied_date: string;
  status: string;
  ai_fit_score: number;
  ai_analysis: string | null;
  resume_text: string | null;
  created_at: string;
  updated_at: string;
}

// Convert database record to frontend Candidate type
function dbToCandidate(record: CandidateDB): Candidate {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    roleApplied: record.role_applied,
    appliedDate: new Date(record.applied_date),
    status: record.status as 'New' | 'Interview' | 'Rejected',
    aiFitScore: record.ai_fit_score,
    aiAnalysis: record.ai_analysis || '',
  };
}

// Fetch all candidates for the current user
export async function fetchCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('applied_date', { ascending: false });

  if (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }

  return (data || []).map(dbToCandidate);
}

// Add a new candidate
export async function addCandidate(candidate: {
  name: string;
  email: string;
  roleApplied: string;
  aiFitScore: number;
  aiAnalysis: string;
  resumeText?: string;
}): Promise<Candidate> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('candidates')
    .insert({
      user_id: user.id,
      name: candidate.name,
      email: candidate.email,
      role_applied: candidate.roleApplied,
      status: 'New',
      ai_fit_score: candidate.aiFitScore,
      ai_analysis: candidate.aiAnalysis,
      resume_text: candidate.resumeText || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }

  return dbToCandidate(data);
}

// Update candidate status
export async function updateCandidateStatus(
  candidateId: string, 
  status: 'New' | 'Interview' | 'Rejected' | 'Hired'
): Promise<void> {
  const { error } = await supabase
    .from('candidates')
    .update({ status })
    .eq('id', candidateId);

  if (error) {
    console.error('Error updating candidate status:', error);
    throw error;
  }
}

// Delete a candidate
export async function deleteCandidate(candidateId: string): Promise<void> {
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', candidateId);

  if (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
}

// Get candidate count for metrics
export async function getCandidateMetrics(): Promise<{
  total: number;
  pending: number;
  interviews: number;
}> {
  const { data, error } = await supabase
    .from('candidates')
    .select('status');

  if (error) {
    console.error('Error fetching metrics:', error);
    return { total: 0, pending: 0, interviews: 0 };
  }

  const total = data?.length || 0;
  const pending = data?.filter(c => c.status === 'New').length || 0;
  const interviews = data?.filter(c => c.status === 'Interview').length || 0;

  return { total, pending, interviews };
}
