create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  career_interests text[] not null default '{}',
  learning_goals text[] not null default '{}',
  experience_level text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  course_id text not null,
  progress integer not null default 0,
  completed_at timestamptz,
  last_accessed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);
grant select, insert, update on public.enrollments to authenticated;
grant all on public.enrollments to service_role;
alter table public.enrollments enable row level security;
create policy "own enrollments read" on public.enrollments for select to authenticated using (auth.uid() = user_id);
-- learners may only self-enrol in free courses; paid enrolment must come from verified payment (server side)
create policy "self enrol free" on public.enrollments for insert to authenticated with check (auth.uid() = user_id and course_id in ('career-kickstart') and progress = 0);
create policy "own progress update" on public.enrollments for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and progress between 0 and 100);