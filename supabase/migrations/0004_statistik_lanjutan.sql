-- Statistik Lanjutan (Prodeskel) — PRD docs/superpowers/specs/2026-07-03-statistik-lanjutan-prd.md §3.2
-- Menambah 2 kebutuhan struktural: dimensi RT (dipakai berulang lintas domain)
-- dan sektor usaha (dipakai identik oleh PDB & Pendapatan Riil).

-- ── Dimensi RT (16 baris, tetap — read-only publik, tanpa CRUD admin) ────
create table wilayah_rt (
  id uuid primary key default gen_random_uuid(),
  nomor text not null unique,   -- "001".."016"
  nama text not null,           -- "RT 001"
  urutan int not null
);

-- ── Fakta per-RT lintas domain ───────────────────────────────────────────
create table statistik_rt (
  id uuid primary key default gen_random_uuid(),
  category text not null,       -- 'penduduk' | 'keluarga' | 'pengangguran' | 'air_bersih' | 'aset_tanaman'
  rt_id uuid not null references wilayah_rt(id) on delete cascade,
  value numeric,                 -- category single-metric (penduduk/keluarga/pengangguran)
  detail jsonb,                  -- category multi-metric (air_bersih, aset_tanaman)
  updated_by uuid references profiles(id),
  updated_at timestamptz default now(),
  unique (category, rt_id)
);

create index idx_statistik_rt_category on statistik_rt (category);

-- ── PDB & Pendapatan Riil per sektor usaha (17 sektor × 2 jenis) ─────────
create table statistik_sektor_usaha (
  id uuid primary key default gen_random_uuid(),
  jenis text not null check (jenis in ('pdb', 'pendapatan_riil')),
  kode text not null,           -- 'A'..'U' (termasuk gabungan "M,N" dan "R,S,T,U" apa adanya dari source)
  nama text not null,
  nilai_ribu_rupiah numeric,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now(),
  urutan int not null,
  unique (jenis, kode)
);

create index idx_statistik_sektor_usaha_jenis on statistik_sektor_usaha (jenis);

-- ── Trigger updated_at (pola sama seperti statistik/wilayah_info) ────────
create trigger set_updated_at_statistik_rt
  before update on statistik_rt
  for each row execute function set_updated_at();

create trigger set_updated_at_statistik_sektor_usaha
  before update on statistik_sektor_usaha
  for each row execute function set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────
alter table wilayah_rt enable row level security;

create policy "wilayah_rt_public_read"
  on wilayah_rt for select
  using (true);

-- Tidak ada policy write untuk wilayah_rt: 16 RT tetap, kalau berubah
-- diedit manual via SQL Editor (PRD §3.2).

do $$
declare
  t text;
  content_tables text[] := array[
    'statistik_rt',
    'statistik_sektor_usaha'
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
