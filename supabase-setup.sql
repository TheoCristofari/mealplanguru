create table if not exists public.recipes (
  id text primary key,
  name text not null,
  ingredients text not null,
  label text default '',
  photo_url text default '',
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.recipes enable row level security;

drop policy if exists "Anyone can read recipes" on public.recipes;
create policy "Anyone can read recipes"
on public.recipes for select
to anon
using (true);

-- Temporary simple setup for a personal project.
-- This lets the public website add, edit, and delete recipes with the publishable key.
-- If the site becomes shared, replace these with authenticated-only policies.
drop policy if exists "Anyone can add recipes" on public.recipes;
create policy "Anyone can add recipes"
on public.recipes for insert
to anon
with check (true);

drop policy if exists "Anyone can edit recipes" on public.recipes;
create policy "Anyone can edit recipes"
on public.recipes for update
to anon
using (true)
with check (true);

drop policy if exists "Anyone can delete recipes" on public.recipes;
create policy "Anyone can delete recipes"
on public.recipes for delete
to anon
using (true);

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can read recipe images" on storage.objects;
create policy "Anyone can read recipe images"
on storage.objects for select
to anon
using (bucket_id = 'recipe-images');

drop policy if exists "Anyone can upload recipe images" on storage.objects;
create policy "Anyone can upload recipe images"
on storage.objects for insert
to anon
with check (bucket_id = 'recipe-images');

drop policy if exists "Anyone can update recipe images" on storage.objects;
create policy "Anyone can update recipe images"
on storage.objects for update
to anon
using (bucket_id = 'recipe-images')
with check (bucket_id = 'recipe-images');

drop policy if exists "Anyone can delete recipe images" on storage.objects;
create policy "Anyone can delete recipe images"
on storage.objects for delete
to anon
using (bucket_id = 'recipe-images');
