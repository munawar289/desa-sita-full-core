-- Perluasan tema warna: latar gelap (panel Navbar/Footer/Hero) & latar
-- halaman (background cream) ikut jadi editable, di luar 3 slot awal
-- (primer/sekunder/aksen) — permintaan lanjutan atas profil-desa PRD §3.5/§4.4.
alter table desa_profil
  add column warna_latar_gelap text not null default '#3d2a1d',
  add column warna_latar text not null default '#f5efe2';
