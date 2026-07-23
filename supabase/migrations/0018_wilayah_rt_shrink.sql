-- Jumlah RT Dinamis — revisi K3: desa_profil.jumlah_rt kini dua arah
-- (PRD docs/superpowers/specs/2026-07-23-jumlah-rt-dinamis-prd.md).
-- Field "Jumlah RT" di Identitas Desa tetap satu-satunya kontrol; hanya
-- boleh menghapus RT trailing (nomor tertinggi) yang belum punya baris
-- statistik_rt sama sekali — dicek di application layer
-- (updateDesaProfilAction), policy ini cuma menggerbangi tenant+role.

create policy "wilayah_rt_staff_delete"
  on wilayah_rt for delete
  using (is_tenant_staff(tenant_id));
