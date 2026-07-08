-- Landlord / Platform Admin Panel — tabel platform_admins TOTAL terpisah dari
-- memberships/tenant manapun (keputusan sengaja, bukan flag di profiles).
-- Sekaligus menutup celah keamanan: RLS tenants/memberships masih pakai
-- is_admin() global (profiles.role) sejak 0009 — artinya admin desa manapun
-- yang kebetulan profiles.role='admin' bisa kelola tenant desa LAIN lewat
-- client Supabase langsung. Diganti is_platform_admin() di migrasi ini.

create table platform_admins (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from platform_admins where profile_id = auth.uid()
  );
$$;

alter table platform_admins enable row level security;

-- Landlord cuma bisa lihat baris dirinya sendiri (bukan daftar landlord lain)
-- — cukup untuk cek "apakah saya landlord", tidak perlu lebih untuk MVP.
create policy "platform_admins_select_self"
  on platform_admins for select
  using (profile_id = auth.uid());

-- SENGAJA tidak ada policy insert/update/delete — onboarding landlord baru
-- murni manual lewat SQL Editor (bootstrap), konsisten pola tenant/membership
-- pertama di 0009. TODO sebelum apply: siapkan insert baris landlord pertama
-- di bawah ini dengan profile_id akun Anda sendiri.

-- ── Perbaikan keamanan: ganti is_admin() (global) → is_platform_admin() ────
drop policy "tenants_admin_write" on tenants;
create policy "tenants_admin_write"
  on tenants for all
  using (is_platform_admin())
  with check (is_platform_admin());

drop policy "memberships_admin_write" on memberships;
create policy "memberships_admin_write"
  on memberships for all
  using (is_platform_admin())
  with check (is_platform_admin());

drop policy "memberships_select_own_or_admin" on memberships;
create policy "memberships_select_own_or_admin"
  on memberships for select
  using (profile_id = auth.uid() or is_platform_admin());

-- ── TODO sebelum apply: ganti '<uuid-profile-anda>' dengan id asli dari
-- `select id from profiles where nama_lengkap = '...'` (atau lewat email di
-- auth.users), lalu uncomment baris di bawah untuk bootstrap landlord pertama.
-- insert into platform_admins (profile_id) values ('<uuid-profile-anda>');
