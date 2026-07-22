-- Arsip nilai warna_latar_gelap & warna_latar sebelum kolomnya di-drop di 0016.
-- Migrasi Design System PRD Fase 8 (K16/S7): drop kolom adalah satu-satunya
-- langkah tak-terbalikkan di seluruh rencana, jadi nilainya disalin dulu ke
-- tabel arsip. Biayanya nyaris nol dan menghapus risiko kehilangan preferensi
-- warna tenant secara permanen.
--
-- Kedua kolom kehilangan konsumen setelah Fase 4 (panel gelap kini = shade
-- gelap warna primer lewat color derivation engine, K4), jadi arsip ini
-- kemungkinan besar tak pernah dibaca — ia murni jaring pengaman.

create table desa_profil_warna_arsip (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  kolom text not null,
  nilai text not null,
  dicatat_pada timestamptz not null default now()
);

-- Salin nilai kedua kolom untuk SEMUA tenant, satu baris per (tenant, kolom).
insert into desa_profil_warna_arsip (tenant_id, kolom, nilai)
select tenant_id, 'warna_latar_gelap', warna_latar_gelap from desa_profil
union all
select tenant_id, 'warna_latar', warna_latar from desa_profil;

-- ── RLS: arsip internal, hanya platform admin yang boleh baca ───────────────
-- Selaras dengan disiplin tenant-scoping repo ini (RLS di setiap tabel). Tak
-- ada policy tulis dari klien: tabel hanya diisi sekali oleh migrasi ini
-- (server-side), tak pernah dari dashboard.
alter table desa_profil_warna_arsip enable row level security;

create policy "warna_arsip_platform_read"
  on desa_profil_warna_arsip for select
  using (is_platform_admin());
