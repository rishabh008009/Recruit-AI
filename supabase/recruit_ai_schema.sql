-- =====================================================
-- RECRUIT AI DATABASE SCHEMA
-- Run this SQL in your NEW Supabase project's SQL Editor
-- Supabase Dashboard → SQL Editor → New Query
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- Stores Recruit AI user profiles
-- =====================================================
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid references auth.users(id) on delete cascade unique,
  name text not null,
  email text unique not null,
  avatar_url text,
  role text default 'recruiter' check (role in ('recruiter', 'admin', 'hiring_manager')),
  company text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =====================================================
-- INDEXES
-- =====================================================
create index idx_users_auth_id on public.users(auth_id);
create index idx_users_email on public.users(email);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at 
  before update on public.users
  for each row execute function update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
alter table public.users enable row level security;

-- Users can view their own profile
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = auth_id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = auth_id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = auth_id);

-- =====================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- This trigger automatically creates a user profile
-- when someone signs up (email/password or Google OAuth)
-- =====================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (auth_id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      'https://ui-avatars.com/api/?name=' || 
      replace(coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), ' ', '+') || 
      '&background=6366f1&color=fff'
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- PERMISSIONS
-- =====================================================
grant usage on schema public to anon, authenticated;
grant all on public.users to anon, authenticated;
