-- Identitas Desa & Tema Warna Editable — PRD docs/superpowers/specs/2026-07-06-profil-desa-prd.md §3.2
-- Profil singleton: satu baris, hanya di-UPDATE dari klien (tidak ada
-- insert/delete lewat dashboard) — baris awal dijamin ada lewat seed di bawah.

create table desa_profil (
  id uuid primary key default gen_random_uuid(),
  nama_desa text not null,
  kecamatan text not null,
  kabupaten text not null,
  provinsi text not null,
  hero_deskripsi text not null,
  email text,
  jam_layanan text,
  zona_waktu text,
  tahun_berdiri int,
  warna_primer text not null default '#c1602a',
  warna_sekunder text not null default '#5b7a41',
  warna_aksen text not null default '#d9a441',
  updated_by uuid references profiles(id),
  updated_at timestamptz default now()
);

insert into desa_profil (
  nama_desa, kecamatan, kabupaten, provinsi, hero_deskripsi,
  email, jam_layanan, zona_waktu, tahun_berdiri,
  warna_primer, warna_sekunder, warna_aksen
) values (
  'Sita', 'Rana Mese', 'Manggarai Timur', 'Nusa Tenggara Timur',
  'Desa agraris di kaki pegunungan Rana Mese — hidup dari hasil kebun dan sawah sejak tahun 1966.',
  'desasita@ranames.manggaraitimurkab.go.id', 'Senin–Jumat, 08.00–16.00', 'WITA', 1966,
  '#c1602a', '#5b7a41', '#d9a441'
);

-- ── Trigger updated_at (pola sama seperti statistik/wilayah_info) ────────
create trigger set_updated_at_desa_profil
  before update on desa_profil
  for each row execute function set_updated_at();

-- ── RLS: baca bebas, tulis admin saja, hanya UPDATE (tanpa insert/delete) ─
-- Beda dari pola `content_tables` generik (yang staf-tulis via `for all`):
-- baris singleton dijamin ada lewat seed di atas, dan identitas resmi desa
-- dianggap data sensitif (§4.3), jadi role tulis admin-only, bukan staf.
alter table desa_profil enable row level security;

create policy "desa_profil_public_read"
  on desa_profil for select
  using (true);

create policy "desa_profil_admin_write"
  on desa_profil for update
  using (is_admin())
  with check (is_admin());
