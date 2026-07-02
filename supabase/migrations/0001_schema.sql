-- Skema inti Desa Sita — PRD §9.1
-- Jalankan berurutan: 0001_schema.sql -> 0002_rls.sql -> 0003_triggers.sql -> seed.sql

create extension if not exists pgcrypto;

-- Profil pengguna & peran, terhubung ke auth.users bawaan Supabase
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama_lengkap text not null,
  role text not null check (role in ('admin', 'operator')),
  created_at timestamptz default now()
);

-- Statistik utama (menggantikan sheet "Statistik")
create table statistik (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  key text not null,
  label text not null,
  value text not null,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now(),
  unique (category, key)
);

-- Sebaran usia
create table statistik_kelompok_umur (
  id uuid primary key default gen_random_uuid(),
  kelompok_usia text not null,     -- "0-4 tahun"
  jumlah int not null,
  urutan int not null
);

-- Tingkat pendidikan
create table statistik_pendidikan (
  id uuid primary key default gen_random_uuid(),
  tingkat text not null,
  jumlah int not null,
  urutan int not null
);

-- Riwayat kepala desa
create table kepala_desa_riwayat (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  periode_mulai int not null,
  periode_selesai int,             -- null = masih menjabat
  keterangan text,                 -- "Penjabat Antar Waktu", dst
  urutan int not null
);

-- Aparatur desa saat ini
create table aparatur (
  id uuid primary key default gen_random_uuid(),
  nama text,
  jabatan text not null,
  pendidikan text,
  urutan int not null
);

-- Anggota BPD
create table bpd_anggota (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jabatan text not null,           -- Ketua/Wakil/Sekretaris/Anggota
  pendidikan text,
  urutan int not null
);

-- Lembaga desa (PKK, Posyandu, Kelompok Tani, dst)
create table lembaga (
  id uuid primary key default gen_random_uuid(),
  kategori text not null,          -- kemasyarakatan | ekonomi | pendidikan | keamanan
  nama text not null,
  dasar_hukum text,
  jumlah_pengurus int,
  keterangan text,
  urutan int not null
);

-- Komoditas pertanian/perkebunan
create table komoditas (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  luas_ha numeric,
  hasil_panen text,
  urutan int not null
);

-- Peternakan
create table peternakan (
  id uuid primary key default gen_random_uuid(),
  jenis_ternak text not null,
  populasi int,
  jumlah_pemilik int,
  urutan int not null
);

-- Sarana & prasarana
create table sarana_prasarana (
  id uuid primary key default gen_random_uuid(),
  kategori text not null,          -- pendidikan | kesehatan | peribadatan | dst
  nama text not null,
  jumlah text,                     -- teks bebas: "3 unit", "562 siswa"
  urutan int not null
);

-- Info wilayah naratif (batas, luas, iklim — konten prosa, bukan tabel)
create table wilayah_info (
  id uuid primary key default gen_random_uuid(),
  section text not null unique,    -- "batas_wilayah", "iklim", "orbitasi"
  konten text not null,            -- boleh markdown sederhana
  updated_at timestamptz default now()
);

-- Berita & pengumuman
create table berita (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text not null unique,
  kategori text,
  ringkasan text,
  konten text not null,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references profiles(id),
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Galeri foto
create table galeri (
  id uuid primary key default gen_random_uuid(),
  judul text,
  image_url text not null,
  urutan int,
  created_at timestamptz default now()
);

-- Pengaduan warga
create table pengaduan (
  id uuid primary key default gen_random_uuid(),
  nama text,                        -- boleh kosong (anonim)
  no_kontak text,
  kategori text,
  isi text not null,
  status text not null default 'baru' check (status in ('baru', 'ditindaklanjuti', 'selesai')),
  tanggapan text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Audit log
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  table_name text not null,
  record_id uuid,
  action text not null,             -- insert | update | delete
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);

-- Indeks bantu untuk pola akses publik yang sering (§7, §9.2)
create index idx_statistik_category on statistik (category);
create index idx_berita_status_published_at on berita (status, published_at desc);
create index idx_lembaga_kategori on lembaga (kategori);
create index idx_pengaduan_status on pengaduan (status);
