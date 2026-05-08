-- Run this in Supabase SQL Editor after deploying the multi-admin site update.
-- It keeps public reading, but only lets each admin change their own recipes/extras.

alter table public.recipes add column if not exists owner_email text;
update public.recipes
set owner_email = 'theo@companydebt.com'
where owner_email is null or owner_email = '';
alter table public.recipes alter column owner_email set not null;
create index if not exists recipes_owner_sort_idx
on public.recipes(owner_email, sort_order, name);
notify pgrst, 'reload schema';

create table if not exists public.shopping_extras (
  id text primary key,
  item text not null,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.shopping_extras add column if not exists owner_email text;
update public.shopping_extras
set owner_email = 'theo@companydebt.com'
where owner_email is null or owner_email = '';
alter table public.shopping_extras alter column owner_email set not null;
alter table public.shopping_extras enable row level security;
create index if not exists shopping_extras_owner_sort_idx
on public.shopping_extras(owner_email, sort_order, item);

drop policy if exists "Anyone can read recipes" on public.recipes;
drop policy if exists "Anyone can add recipes" on public.recipes;
drop policy if exists "Anyone can edit recipes" on public.recipes;
drop policy if exists "Anyone can delete recipes" on public.recipes;
drop policy if exists "Admin can add recipes" on public.recipes;
drop policy if exists "Admin can edit recipes" on public.recipes;
drop policy if exists "Admin can delete recipes" on public.recipes;
drop policy if exists "Owners can read recipes" on public.recipes;
drop policy if exists "Owners can add recipes" on public.recipes;
drop policy if exists "Owners can edit recipes" on public.recipes;
drop policy if exists "Owners can delete recipes" on public.recipes;

create policy "Owners can read recipes"
on public.recipes for select
to anon, authenticated
using (
  owner_email = 'theo@companydebt.com'
  or owner_email = lower(auth.jwt() ->> 'email')
);

create policy "Owners can add recipes"
on public.recipes for insert
to authenticated
with check (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

create policy "Owners can edit recipes"
on public.recipes for update
to authenticated
using (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
)
with check (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

create policy "Owners can delete recipes"
on public.recipes for delete
to authenticated
using (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

drop policy if exists "Anyone can read shopping extras" on public.shopping_extras;
drop policy if exists "Anyone can add shopping extras" on public.shopping_extras;
drop policy if exists "Anyone can edit shopping extras" on public.shopping_extras;
drop policy if exists "Anyone can delete shopping extras" on public.shopping_extras;
drop policy if exists "Owners can read shopping extras" on public.shopping_extras;
drop policy if exists "Owners can add shopping extras" on public.shopping_extras;
drop policy if exists "Owners can edit shopping extras" on public.shopping_extras;
drop policy if exists "Owners can delete shopping extras" on public.shopping_extras;

create policy "Owners can read shopping extras"
on public.shopping_extras for select
to anon, authenticated
using (
  owner_email = 'theo@companydebt.com'
  or owner_email = lower(auth.jwt() ->> 'email')
);

create policy "Owners can add shopping extras"
on public.shopping_extras for insert
to authenticated
with check (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

create policy "Owners can edit shopping extras"
on public.shopping_extras for update
to authenticated
using (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
)
with check (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

create policy "Owners can delete shopping extras"
on public.shopping_extras for delete
to authenticated
using (
  owner_email = lower(auth.jwt() ->> 'email')
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can read recipe images" on storage.objects;
create policy "Anyone can read recipe images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'recipe-images');

drop policy if exists "Anyone can upload recipe images" on storage.objects;
drop policy if exists "Anyone can update recipe images" on storage.objects;
drop policy if exists "Anyone can delete recipe images" on storage.objects;
drop policy if exists "Admin can upload recipe images" on storage.objects;
drop policy if exists "Admin can update recipe images" on storage.objects;
drop policy if exists "Admin can delete recipe images" on storage.objects;
drop policy if exists "Admins can upload recipe images" on storage.objects;
drop policy if exists "Admins can update recipe images" on storage.objects;
drop policy if exists "Admins can delete recipe images" on storage.objects;

create policy "Admins can upload recipe images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'recipe-images'
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

create policy "Admins can update recipe images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'recipe-images'
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
)
with check (
  bucket_id = 'recipe-images'
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

create policy "Admins can delete recipe images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'recipe-images'
  and lower(auth.jwt() ->> 'email') in ('theo@companydebt.com', 'simon.cristofari@icloud.com')
);

notify pgrst, 'reload schema';
