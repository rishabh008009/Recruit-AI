-- =====================================================
-- CANDIDATES TABLE FOR RECRUIT AI
-- Run this SQL in your Supabase project's SQL Editor
-- Supabase Dashboard → SQL Editor → New Query
-- =====================================================

-- =====================================================
-- CANDIDATES TABLE
-- Stores candidate information and AI analysis results
-- =====================================================
create table if not exists public.candidates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text not null,
  role_applied text not null,
  applied_date timestamp with time zone default now(),
  status text default 'New' check (status in ('New', 'Interview', 'Rejected', 'Hired')),
  ai_fit_score integer default 0 check (ai_fit_score >= 0 and ai_fit_score <= 100),
  ai_analysis text,
  resume_text text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =====================================================
-- INDEXES
-- =====================================================
create index if not exists idx_candidates_user_id on public.candidates(user_id);
create index if not exists idx_candidates_status on public.candidates(status);
create index if not exists idx_candidates_applied_date on public.candidates(applied_date desc);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
create trigger update_candidates_updated_at 
  before update on public.candidates
  for each row execute function update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
alter table public.candidates enable row level security;

-- Users can view their own candidates
create policy "Users can view own candidates"
  on public.candidates for select
  using (auth.uid() = user_id);

-- Users can insert their own candidates
create policy "Users can insert own candidates"
  on public.candidates for insert
  with check (auth.uid() = user_id);

-- Users can update their own candidates
create policy "Users can update own candidates"
  on public.candidates for update
  using (auth.uid() = user_id);

-- Users can delete their own candidates
create policy "Users can delete own candidates"
  on public.candidates for delete
  using (auth.uid() = user_id);

-- =====================================================
-- PERMISSIONS
-- =====================================================
grant all on public.candidates to authenticated;
