-- wilayah_info jadi sepenuhnya data-driven: section baru yang dibuat admin
-- lewat "Tambah Section" langsung tampil di halaman publik tanpa perlu
-- tambahan kode, karena page/judul/eyebrow/urutan kini disimpan di baris
-- itu sendiri (sebelumnya hardcode di wilayah-info-sections.ts).
alter table wilayah_info
  add column page text not null default 'wilayah' check (page in ('wilayah', 'sejarah')),
  add column judul text not null default '',
  add column eyebrow text not null default '',
  add column urutan int not null default 0;

update wilayah_info set page = 'sejarah', judul = 'Sejarah Desa Sita', eyebrow = 'Narasi', urutan = 0
  where section = 'sejarah';
update wilayah_info set page = 'wilayah', judul = 'Batas Wilayah', eyebrow = 'Geografi', urutan = 0
  where section = 'batas_wilayah';
update wilayah_info set page = 'wilayah', judul = 'Iklim', eyebrow = 'Cuaca', urutan = 1
  where section = 'iklim';
update wilayah_info set page = 'wilayah', judul = 'Orbitasi', eyebrow = 'Jarak Tempuh', urutan = 2
  where section = 'orbitasi';
