-- Statistik Lanjutan (Prodeskel) — Kelompok 2: Pendidikan, Kesehatan,
-- Keamanan & Kelembagaan, Indeks Ketersediaan Data Prodeskel
-- PRD docs/superpowers/specs/2026-07-03-statistik-lanjutan-prd.md §3.3, §6
--
-- Jalankan SETELAH migrations/0004_statistik_lanjutan.sql dan
-- seed_lanjutan_kelompok1.sql. Sumber angka: `Template Ragam Data dan
-- Template Tabel daesa Sita.xlsx`.

-- ── Pendidikan — rasio guru-murid & kelembagaan pendidikan ──────────────
-- "Murid" kosong di source — baris tidak diinsert (bukan diisi 0), supaya
-- halaman publik menampilkan apa yang benar-benar diketahui saja.
insert into statistik (category, key, label, value, updated_at) values
  ('rasio_guru_murid', 'guru', 'Guru', '120', now()),
  ('lembaga_pendidikan_negeri', 'sd', 'SD Negeri', '1', now()),
  ('lembaga_pendidikan_swasta', 'paud', 'PAUD Swasta', '3', now()),
  ('lembaga_pendidikan_swasta', 'sd', 'SD Swasta', '2', now()),
  ('lembaga_pendidikan_swasta', 'smp', 'SMP Swasta', '2', now()),
  ('lembaga_pendidikan_swasta', 'sma', 'SMA Swasta', '2', now())
on conflict (category, key) do update set value = excluded.value, updated_at = now();

-- ── Kesehatan — sarana & prasarana (terisi) ──────────────────────────────
insert into statistik (category, key, label, value, updated_at) values
  ('sarana_kesehatan', 'posyandu', 'Posyandu', '9 Titik', now()),
  ('sarana_kesehatan', 'puskesmas', 'Puskesmas', '1', now()),
  ('sarana_kesehatan', 'poskesdes', 'Poskesdes', '1', now()),
  ('sarana_kesehatan', 'polindes', 'Polindes', '1', now()),
  ('sarana_kesehatan', 'toko_obat', 'Toko Obat', '2', now())
on conflict (category, key) do update set value = excluded.value, updated_at = now();

-- kualitas_bayi, kualitas_ibu_hamil, kualitas_persalinan, wabah_penyakit,
-- gizi_balita, imunisasi, kb_jangka_panjang, kb_non_jangka_panjang: sengaja
-- TIDAK diinsert (kosong total di source) — publik menampilkan EmptyState.

-- ── Kesehatan — cakupan air bersih per RT ────────────────────────────────
-- Source: RT 001-013 kolom "PDAM" terisi, RT 014-016 kolom "Air Ledeng"
-- terisi (bukan PDAM) — nilainya identik dengan total Keluarga per RT yang
-- sama (lihat PRD §8, pertanyaan terbuka), jadi dibaca sebagai: seluruh KK
-- di RT tsb mengakses air bersih via SATU sumber (PDAM utk 001-013, Air
-- Ledeng utk 014-016) — bukan dua sumber terpisah per RT. Asumsi ini perlu
-- dikonfirmasi ke pemdes; sampai saat itu, data ditampilkan apa adanya.
insert into statistik_rt (category, rt_id, detail, updated_at)
select 'air_bersih', wr.id,
  jsonb_build_object('pdam', v.pdam, 'ledeng', v.ledeng),
  now()
from (values
  ('001', 44, 0), ('002', 44, 0), ('003', 61, 0), ('004', 41, 0),
  ('005', 51, 0), ('006', 65, 0), ('007', 55, 0), ('008', 46, 0),
  ('009', 50, 0), ('010', 59, 0), ('011', 42, 0), ('012', 72, 0),
  ('013', 42, 0), ('014', 0, 86), ('015', 0, 51), ('016', 0, 64)
) as v(nomor, pdam, ledeng)
join wilayah_rt wr on wr.nomor = v.nomor
on conflict (category, rt_id) do update set detail = excluded.detail, updated_at = now();

-- ── Keamanan & Ketertiban (terisi) ───────────────────────────────────────
insert into statistik (category, key, label, value, updated_at) values
  ('keamanan', 'linmas', 'Linmas Desa Sita', '7 Orang', now())
on conflict (category, key) do update set value = excluded.value, updated_at = now();

-- ── Lembaga Kemasyarakatan (terisi) ──────────────────────────────────────
insert into statistik (category, key, label, value, updated_at) values
  ('lembaga_kemasyarakatan', 'rt', 'Rukun Tetangga (RT)', '16', now()),
  ('lembaga_kemasyarakatan', 'rw', 'Rukun Warga (RW)', '8', now()),
  ('lembaga_kemasyarakatan', 'pkk', 'PKK', '6', now()),
  ('lembaga_kemasyarakatan', 'posyandu', 'Posyandu', '9', now()),
  ('lembaga_kemasyarakatan', 'lembaga_adat', 'Lembaga Adat Desa', '5', now()),
  ('lembaga_kemasyarakatan', 'dusun', 'Dusun', '4', now())
on conflict (category, key) do update set value = excluded.value, updated_at = now();
