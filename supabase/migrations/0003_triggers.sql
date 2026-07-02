-- Triggers — PRD §10 (auto-create profile) & §9.2 (updated_at sebagai
-- tulang punggung fitur "data mutakhir")

-- ── Auto-create baris `profiles` saat user baru dibuat di Supabase Auth ──
-- Role default 'operator'; admin menaikkan jadi 'admin' lewat dashboard.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nama_lengkap, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nama_lengkap', new.email),
    'operator'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Auto-update kolom updated_at saat baris diubah ──────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_statistik
  before update on statistik
  for each row execute function public.set_updated_at();

create trigger set_updated_at_wilayah_info
  before update on wilayah_info
  for each row execute function public.set_updated_at();

create trigger set_updated_at_pengaduan
  before update on pengaduan
  for each row execute function public.set_updated_at();
