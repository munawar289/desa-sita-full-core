-- Drop kolom warna_latar_gelap & warna_latar dari desa_profil.
-- Migrasi Design System PRD Fase 8 (K3). Nilainya sudah diarsipkan di
-- 0015_arsip_warna_latar.sql (K16) sebelum langkah ini dijalankan.
--
-- Kedua kolom kehilangan seluruh konsumennya setelah Fase 1–7: panel gelap
-- (Navbar/Footer/Hero) kini shade gelap warna primer, dan latar halaman
-- diturunkan dari netral ber-tint — keduanya dari color derivation engine,
-- bukan lagi dua slot warna mentah pilihan admin (K4).

alter table desa_profil
  drop column warna_latar_gelap,
  drop column warna_latar;

-- ── Pembalikan (down) ───────────────────────────────────────────────────────
-- Supabase memakai migrasi maju (forward-only) — tak ada blok down otomatis.
-- Untuk mengembalikan kolom beserta default aslinya DAN nilai per-tenant dari
-- arsip, jalankan SQL berikut secara manual (AC10):
--
--   alter table desa_profil
--     add column warna_latar_gelap text not null default '#3d2a1d',
--     add column warna_latar text not null default '#f5efe2';
--
--   update desa_profil d
--     set warna_latar_gelap = a.nilai
--     from desa_profil_warna_arsip a
--     where a.tenant_id = d.tenant_id and a.kolom = 'warna_latar_gelap';
--
--   update desa_profil d
--     set warna_latar = a.nilai
--     from desa_profil_warna_arsip a
--     where a.tenant_id = d.tenant_id and a.kolom = 'warna_latar';
