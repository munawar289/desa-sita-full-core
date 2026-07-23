-- Foto latar Hero — BACKEND_TODO.md #1. desa_profil belum punya kolom
-- gambar hero, jadi UI beranda selama ini dipatok ke aset lokal (mock).
-- Sekarang admin bisa unggah fotonya sendiri lewat form Identitas Desa.

alter table desa_profil
  add column hero_gambar_url text,
  add column hero_gambar_alt text;

-- ── Storage bucket khusus foto hero, public (dipakai di halaman beranda) ──
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('desa-hero', 'desa-hero', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Path objek berpola `{tenant_id}/{filename}` — folder pertama dipakai untuk
-- scoping RLS per tenant, sama seperti pola is_tenant_admin() di tabel biasa.
create policy "desa_hero_public_read"
  on storage.objects for select
  using (bucket_id = 'desa-hero');

create policy "desa_hero_tenant_admin_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'desa-hero'
    and is_tenant_admin(((storage.foldername(name))[1])::uuid)
  );

create policy "desa_hero_tenant_admin_update"
  on storage.objects for update
  using (
    bucket_id = 'desa-hero'
    and is_tenant_admin(((storage.foldername(name))[1])::uuid)
  );

create policy "desa_hero_tenant_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'desa-hero'
    and is_tenant_admin(((storage.foldername(name))[1])::uuid)
  );
