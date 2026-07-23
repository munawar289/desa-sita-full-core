-- Jumlah RT Dinamis — PRD docs/superpowers/specs/2026-07-23-jumlah-rt-dinamis-prd.md §K1, K5
-- `desa_profil.jumlah_rt` jadi satu-satunya sumber kebenaran yang mengontrol
-- jumlah baris `wilayah_rt`, menggantikan angka statis 16. Grow-only by
-- design: hanya INSERT policy yang ditambah, wilayah_rt tetap tanpa
-- UPDATE/DELETE policy (0004_statistik_lanjutan.sql, 0012_tenant_scoping_modul3.sql).

alter table desa_profil
  add column jumlah_rt integer not null default 16 check (jumlah_rt >= 1);

-- INSERT-only, tenant-scoped: admin/operator boleh menambah baris RT baru
-- lewat action grow-only, tapi tidak ada policy UPDATE/DELETE — mengecilkan
-- atau mengedit baris wilayah_rt tetap harus manual SQL Editor.
create policy "wilayah_rt_staff_insert"
  on wilayah_rt for insert
  with check (is_tenant_staff(tenant_id));
