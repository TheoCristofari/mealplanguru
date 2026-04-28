-- Run this after the site has been updated with admin login.
-- It keeps public recipe/image reading, but locks recipe and image changes to the admin email.

drop policy if exists "Anyone can add recipes" on public.recipes;
drop policy if exists "Anyone can edit recipes" on public.recipes;
drop policy if exists "Anyone can delete recipes" on public.recipes;

drop policy if exists "Admin can add recipes" on public.recipes;
create policy "Admin can add recipes"
on public.recipes for insert
to authenticated
with check (auth.jwt() ->> 'email' = 'theo@companydebt.com');

drop policy if exists "Admin can edit recipes" on public.recipes;
create policy "Admin can edit recipes"
on public.recipes for update
to authenticated
using (auth.jwt() ->> 'email' = 'theo@companydebt.com')
with check (auth.jwt() ->> 'email' = 'theo@companydebt.com');

drop policy if exists "Admin can delete recipes" on public.recipes;
create policy "Admin can delete recipes"
on public.recipes for delete
to authenticated
using (auth.jwt() ->> 'email' = 'theo@companydebt.com');

drop policy if exists "Anyone can upload recipe images" on storage.objects;
drop policy if exists "Anyone can update recipe images" on storage.objects;
drop policy if exists "Anyone can delete recipe images" on storage.objects;

drop policy if exists "Admin can upload recipe images" on storage.objects;
create policy "Admin can upload recipe images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'recipe-images'
  and auth.jwt() ->> 'email' = 'theo@companydebt.com'
);

drop policy if exists "Admin can update recipe images" on storage.objects;
create policy "Admin can update recipe images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'recipe-images'
  and auth.jwt() ->> 'email' = 'theo@companydebt.com'
)
with check (
  bucket_id = 'recipe-images'
  and auth.jwt() ->> 'email' = 'theo@companydebt.com'
);

drop policy if exists "Admin can delete recipe images" on storage.objects;
create policy "Admin can delete recipe images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'recipe-images'
  and auth.jwt() ->> 'email' = 'theo@companydebt.com'
);
