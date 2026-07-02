-- Row Level Security — PRD §9.3, §10
-- Prinsip: RLS aktif di SEMUA tabel. Client Supabase bisa dipanggil langsung
-- dari browser, jadi otorisasi sesungguhnya ada di sini, bukan di kode aplikasi.

-- ── Helper: cek role user yang sedang login ─────────────────────────────
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'operator')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ── profiles ─────────────────────────────────────────────────────────────
alter table profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on profiles for select
  using (id = auth.uid() or is_admin());

-- Insert dilakukan oleh trigger handle_new_user() (security definer di
-- 0003_triggers.sql), jadi tidak ada policy insert untuk client langsung.

create policy "profiles_update_admin_only"
  on profiles for update
  using (is_admin());

create policy "profiles_delete_admin_only"
  on profiles for delete
  using (is_admin());

-- ── Tabel konten publik: baca bebas, tulis oleh staf (admin/operator) ────
-- Pola sama untuk semua tabel referensi/statistik non-sensitif.
do $$
declare
  t text;
  content_tables text[] := array[
    'statistik',
    'statistik_kelompok_umur',
    'statistik_pendidikan',
    'kepala_desa_riwayat',
    'komoditas',
    'peternakan',
    'sarana_prasarana',
    'wilayah_info',
    'galeri'
  ];
begin
  foreach t in array content_tables loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy "%s_public_read" on %I for select using (true);',
      t, t
    );
    execute format(
      'create policy "%s_staff_write" on %I for all using (is_staff()) with check (is_staff());',
      t, t
    );
  end loop;
end $$;

-- ── aparatur & bpd_anggota: baca bebas, tulis oleh admin saja (§8.1) ─────
alter table aparatur enable row level security;

create policy "aparatur_public_read"
  on aparatur for select
  using (true);

create policy "aparatur_admin_write"
  on aparatur for all
  using (is_admin())
  with check (is_admin());

alter table bpd_anggota enable row level security;

create policy "bpd_anggota_public_read"
  on bpd_anggota for select
  using (true);

create policy "bpd_anggota_admin_write"
  on bpd_anggota for all
  using (is_admin())
  with check (is_admin());

-- ── lembaga: baca bebas, tulis staf, urutan/kategori dikelola operator ───
alter table lembaga enable row level security;

create policy "lembaga_public_read"
  on lembaga for select
  using (true);

create policy "lembaga_staff_write"
  on lembaga for all
  using (is_staff())
  with check (is_staff());

-- ── berita: publik hanya lihat yang published, staf lihat & kelola semua ─
alter table berita enable row level security;

create policy "berita_public_read_published"
  on berita for select
  using (status = 'published' or is_staff());

create policy "berita_staff_write"
  on berita for all
  using (is_staff())
  with check (is_staff());

-- ── pengaduan: warga (bahkan anonim) boleh INSERT, tidak boleh SELECT ────
-- Data pribadi (nama, no_kontak) tidak pernah diekspos ke endpoint publik.
alter table pengaduan enable row level security;

create policy "pengaduan_public_insert"
  on pengaduan for insert
  with check (true);

create policy "pengaduan_staff_read"
  on pengaduan for select
  using (is_staff());

create policy "pengaduan_staff_update"
  on pengaduan for update
  using (is_staff())
  with check (is_staff());

-- ── audit_log: tulis lewat trigger (security definer), baca admin saja ──
alter table audit_log enable row level security;

create policy "audit_log_admin_read"
  on audit_log for select
  using (is_admin());
