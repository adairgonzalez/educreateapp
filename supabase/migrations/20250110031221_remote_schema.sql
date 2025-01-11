create type learning_style as enum (
  'visual',
  'auditory',
  'reading',
  'kinesthetic'
);

create type difficulty_level as enum (
  'beginner',
  'intermediate',
  'advanced'
);
create table learning_profiles (
  id uuid references auth.users on delete cascade primary key,
  learning_style learning_style,
  preferred_subjects text[],
  difficulty_level difficulty_level default 'beginner',
  watch_history jsonb[] default array[]::jsonb[],
  quiz_results jsonb[] default array[]::jsonb[],
  study_patterns jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  content_interaction_patterns jsonb default '{
    "video_interactions": [],
    "text_interactions": [],
    "interactive_elements": [],
    "navigation_patterns": []
  }'::jsonb,
  daily_learning_analysis jsonb default '{
    "date": null,
    "interaction_count": 0,
    "content_type_distribution": {},
    "average_engagement_time": {},
    "preferred_study_times": []
  }'::jsonb,
  weekly_learning_analysis jsonb default '{
    "week_start_date": null,
    "aggregated_style_weights": {
      "visual": 0.25,
      "auditory": 0.25,
      "reading": 0.25,
      "kinesthetic": 0.25
    },
    "dominant_patterns": [],
    "weekly_progress": {
      "total_interactions": 0
    }
  }'::jsonb,
  interaction_metrics jsonb default '{
    "total_interactions": 0,
    "last_analysis_timestamp": null,
    "daily_interaction_threshold": 10,
    "style_confidence_score": 0
  }'::jsonb
);

alter table learning_profiles enable row level security;

-- Drop existing policies if any
drop policy if exists "Users can view own learning profile" on learning_profiles;
drop policy if exists "Users can update own learning profile" on learning_profiles;
drop policy if exists "Users can insert own learning profile" on learning_profiles;

-- Create comprehensive RLS policies
create policy "Users can manage own learning profile"
on learning_profiles
for all -- this covers SELECT, INSERT, UPDATE, and DELETE
using (auth.uid() = id)
with check (auth.uid() = id);

-- Ensure authenticated users can insert their profile
create policy "Enable insert for authenticated users only"
on learning_profiles
for insert
with check (auth.uid() = id);

-- Create RLS policies
create policy "Users can view own learning profile"
  on learning_profiles for select
  using (auth.uid() = id);
create table "public"."customers" (
    "customer_id" uuid not null default gen_random_uuid(),
    "username" text,
    "role" text default '''student'''::text,
    "full_name" text
);


alter table "public"."customers" enable row level security;

create table "public"."subscriptions" (
    "subscription_id" text not null,
    "subscription_status" text not null,
    "price_id" text,
    "product_id" text,
    "scheduled_change" text,
    "customer_id" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."learning_profiles" alter column "id" set default gen_random_uuid();

alter table "public"."learning_profiles" alter column "learning_style" set not null;

alter table "public"."learning_profiles" alter column "quiz_results" drop default;

alter table "public"."learning_profiles" alter column "study_patterns" drop default;

alter table "public"."learning_profiles" alter column "watch_history" drop default;

CREATE UNIQUE INDEX customers_pkey ON public.customers USING btree (customer_id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (subscription_id);

alter table "public"."customers" add constraint "customers_pkey" PRIMARY KEY using index "customers_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."customers" add constraint "customers_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."customers" validate constraint "customers_customer_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
    insert into public.customers (customer_id, username)
    values (
        new.id,
        new.raw_user_meta_data->>'username'
    );
    return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  new.updated_at = now();
    return new;
END$function$
;

grant delete on table "public"."customers" to "anon";

grant insert on table "public"."customers" to "anon";

grant references on table "public"."customers" to "anon";

grant select on table "public"."customers" to "anon";

grant trigger on table "public"."customers" to "anon";

grant truncate on table "public"."customers" to "anon";

grant update on table "public"."customers" to "anon";

grant delete on table "public"."customers" to "authenticated";

grant insert on table "public"."customers" to "authenticated";

grant references on table "public"."customers" to "authenticated";

grant select on table "public"."customers" to "authenticated";

grant trigger on table "public"."customers" to "authenticated";

grant truncate on table "public"."customers" to "authenticated";

grant update on table "public"."customers" to "authenticated";

grant delete on table "public"."customers" to "service_role";

grant insert on table "public"."customers" to "service_role";

grant references on table "public"."customers" to "service_role";

grant select on table "public"."customers" to "service_role";

grant trigger on table "public"."customers" to "service_role";

grant truncate on table "public"."customers" to "service_role";

grant update on table "public"."customers" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

create policy "Check if role is valid"
on "public"."customers"
as permissive
for insert
to public
with check ((role = ANY (ARRAY['student'::text, 'teacher'::text])));


create policy "Enable read access for authenticated users to customers"
on "public"."customers"
as permissive
for select
to authenticated
using (true);


create policy "Public profiles are viewable by everyone"
on "public"."customers"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile"
on "public"."customers"
as permissive
for update
to authenticated
using ((auth.uid() = customer_id));


create policy "Users can update their own profile"
on "public"."customers"
as permissive
for insert
to public
with check ((auth.uid() = customer_id));


create policy "Enable read access for authenticated users to subscriptions"
on "public"."subscriptions"
as permissive
for select
to authenticated
using (true);

create trigger update_learning_profiles_updated_at
  before update on learning_profiles
  for each row
  execute function update_updated_at_column();

create table if not exists videos (
  id text default uuid_generate_v4()::text primary key,
  title text not null,
  transcript text,
  duration integer,
  youtube_id text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb
);

-- Add indexes for better performance
create index if not exists videos_title_idx on videos using gin (to_tsvector('english'::regconfig, title));
create index if not exists videos_transcript_idx on videos using gin (to_tsvector('english'::regconfig, transcript));
create index if not exists videos_youtube_id_idx on videos (youtube_id);

-- Add RLS policies
alter table videos enable row level security;

create policy "Videos are viewable by everyone"
  on videos for select
  to public
  using (true);

-- Create trigger for updated_at
create trigger update_videos_updated_at
  before update on videos
  for each row
  execute function update_updated_at_column();

-- Add insert policy for videos
create policy "Anyone can insert videos"
  on videos for insert
  to public
  with check (true);

-- Add update policy for videos
create policy "Anyone can update videos"
  on videos for update
  to public
  using (true);

-- Add a comment to explain the structure
comment on table learning_profiles is 'Stores user learning profiles with detailed behavioral tracking and analysis';

alter table learning_profiles
add column if not exists content_interaction_patterns jsonb default '{
  "video_interactions": [],
  "text_interactions": [],
  "interactive_elements": [],
  "navigation_patterns": []
}'::jsonb,
add column if not exists daily_learning_analysis jsonb default '{
  "date": null,
  "interaction_count": 0,
  "content_type_distribution": {},
  "average_engagement_time": {},
  "preferred_study_times": []
}'::jsonb,
add column if not exists weekly_learning_analysis jsonb default '{
  "week_start_date": null,
  "aggregated_style_weights": {
    "visual": 0.25,
    "auditory": 0.25,
    "reading": 0.25,
    "kinesthetic": 0.25
  },
  "dominant_patterns": [],
  "weekly_progress": {
    "total_interactions": 0
  }
}'::jsonb,
add column if not exists interaction_metrics jsonb default '{
  "total_interactions": 0,
  "last_analysis_timestamp": null,
  "daily_interaction_threshold": 10,
  "style_confidence_score": 0
}'::jsonb;

