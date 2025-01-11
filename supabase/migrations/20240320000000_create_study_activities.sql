create table if not exists public.study_activities (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  activity_type text not null,
  video_id text,
  learning_style text[],
  session_id text,
  current_section integer,
  progress integer,
  data jsonb,
  timestamp timestamptz default now(),
  created_at timestamptz default now()
);

-- Add RLS policies
alter table public.study_activities enable row level security;

-- Update RLS policies to handle anonymous users
drop policy if exists "Users can insert their own activities" on public.study_activities;
drop policy if exists "Users can view their own activities" on public.study_activities;

create policy "Anyone can insert activities"
  on public.study_activities for insert
  with check (true);

create policy "Users can view their own activities"
  on public.study_activities for select
  using (
    auth.uid()::text = user_id 
    or user_id = 'anonymous'
    or user_id like 'default-%'
  ); 