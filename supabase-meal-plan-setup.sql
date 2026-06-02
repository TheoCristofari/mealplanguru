-- Run this once in Supabase SQL Editor to persist planner selections.

create table if not exists public.meal_plans (
  owner_email text primary key,
  assignments jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.meal_plans enable row level security;

drop policy if exists "Owners can read meal plans" on public.meal_plans;
drop policy if exists "Owners can add meal plans" on public.meal_plans;
drop policy if exists "Owners can edit meal plans" on public.meal_plans;
drop policy if exists "Owners can delete meal plans" on public.meal_plans;

create policy "Owners can read meal plans"
on public.meal_plans for select
to anon, authenticated
using (
  owner_email = 'theo@companydebt.com'
  or owner_email = lower(auth.jwt() ->> 'email')
);

create policy "Owners can add meal plans"
on public.meal_plans for insert
to authenticated
with check (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

create policy "Owners can edit meal plans"
on public.meal_plans for update
to authenticated
using (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
)
with check (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

create policy "Owners can delete meal plans"
on public.meal_plans for delete
to authenticated
using (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

notify pgrst, 'reload schema';
