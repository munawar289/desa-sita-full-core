-- Phase 4 Modul 3 — batch tenant_id untuk 14 tabel publik generik + pasangan
-- wilayah_rt/statistik_rt. `galeri`/`berita` tetap di-skip (dead feature,
-- PRD phase4 §7 Modul 5). Pola identik migrasi 0011 (desa_profil): kolom
-- metadata-only + FK NOT VALID/VALIDATE terpisah, RLS write jadi tenant-scoped.

-- ── statistik ───────────────────────────────────────────────────────────
alter table statistik add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table statistik add constraint statistik_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table statistik validate constraint statistik_tenant_id_fkey;
alter table statistik drop constraint statistik_category_key_key;
alter table statistik add constraint statistik_tenant_category_key_key unique (tenant_id, category, key);

drop policy "statistik_staff_write" on statistik;
create policy "statistik_staff_write" on statistik for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── statistik_kelompok_umur ─────────────────────────────────────────────
alter table statistik_kelompok_umur add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table statistik_kelompok_umur add constraint statistik_kelompok_umur_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table statistik_kelompok_umur validate constraint statistik_kelompok_umur_tenant_id_fkey;
create index idx_statistik_kelompok_umur_tenant_id on statistik_kelompok_umur (tenant_id);

drop policy "statistik_kelompok_umur_staff_write" on statistik_kelompok_umur;
create policy "statistik_kelompok_umur_staff_write" on statistik_kelompok_umur for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── statistik_pendidikan ────────────────────────────────────────────────
alter table statistik_pendidikan add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table statistik_pendidikan add constraint statistik_pendidikan_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table statistik_pendidikan validate constraint statistik_pendidikan_tenant_id_fkey;
create index idx_statistik_pendidikan_tenant_id on statistik_pendidikan (tenant_id);

drop policy "statistik_pendidikan_staff_write" on statistik_pendidikan;
create policy "statistik_pendidikan_staff_write" on statistik_pendidikan for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── kepala_desa_riwayat ─────────────────────────────────────────────────
alter table kepala_desa_riwayat add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table kepala_desa_riwayat add constraint kepala_desa_riwayat_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table kepala_desa_riwayat validate constraint kepala_desa_riwayat_tenant_id_fkey;
create index idx_kepala_desa_riwayat_tenant_id on kepala_desa_riwayat (tenant_id);

drop policy "kepala_desa_riwayat_staff_write" on kepala_desa_riwayat;
create policy "kepala_desa_riwayat_staff_write" on kepala_desa_riwayat for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── komoditas ───────────────────────────────────────────────────────────
alter table komoditas add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table komoditas add constraint komoditas_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table komoditas validate constraint komoditas_tenant_id_fkey;
create index idx_komoditas_tenant_id on komoditas (tenant_id);

drop policy "komoditas_staff_write" on komoditas;
create policy "komoditas_staff_write" on komoditas for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── peternakan ──────────────────────────────────────────────────────────
alter table peternakan add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table peternakan add constraint peternakan_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table peternakan validate constraint peternakan_tenant_id_fkey;
create index idx_peternakan_tenant_id on peternakan (tenant_id);

drop policy "peternakan_staff_write" on peternakan;
create policy "peternakan_staff_write" on peternakan for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── sarana_prasarana ────────────────────────────────────────────────────
alter table sarana_prasarana add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table sarana_prasarana add constraint sarana_prasarana_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table sarana_prasarana validate constraint sarana_prasarana_tenant_id_fkey;
create index idx_sarana_prasarana_tenant_id on sarana_prasarana (tenant_id);

drop policy "sarana_prasarana_staff_write" on sarana_prasarana;
create policy "sarana_prasarana_staff_write" on sarana_prasarana for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── wilayah_info ────────────────────────────────────────────────────────
alter table wilayah_info add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table wilayah_info add constraint wilayah_info_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table wilayah_info validate constraint wilayah_info_tenant_id_fkey;
alter table wilayah_info drop constraint wilayah_info_section_key;
alter table wilayah_info add constraint wilayah_info_tenant_section_key unique (tenant_id, section);

drop policy "wilayah_info_staff_write" on wilayah_info;
create policy "wilayah_info_staff_write" on wilayah_info for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── lembaga ─────────────────────────────────────────────────────────────
alter table lembaga add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table lembaga add constraint lembaga_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table lembaga validate constraint lembaga_tenant_id_fkey;
create index idx_lembaga_tenant_id on lembaga (tenant_id);

drop policy "lembaga_staff_write" on lembaga;
create policy "lembaga_staff_write" on lembaga for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── aparatur (admin-only write, bukan staff — mempertahankan semantik lama) ─
alter table aparatur add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table aparatur add constraint aparatur_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table aparatur validate constraint aparatur_tenant_id_fkey;
create index idx_aparatur_tenant_id on aparatur (tenant_id);

drop policy "aparatur_admin_write" on aparatur;
create policy "aparatur_admin_write" on aparatur for all using (is_tenant_admin(tenant_id)) with check (is_tenant_admin(tenant_id));

-- ── bpd_anggota (admin-only write) ──────────────────────────────────────
alter table bpd_anggota add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table bpd_anggota add constraint bpd_anggota_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table bpd_anggota validate constraint bpd_anggota_tenant_id_fkey;
create index idx_bpd_anggota_tenant_id on bpd_anggota (tenant_id);

drop policy "bpd_anggota_admin_write" on bpd_anggota;
create policy "bpd_anggota_admin_write" on bpd_anggota for all using (is_tenant_admin(tenant_id)) with check (is_tenant_admin(tenant_id));

-- ── potensi_desa ────────────────────────────────────────────────────────
alter table potensi_desa add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table potensi_desa add constraint potensi_desa_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table potensi_desa validate constraint potensi_desa_tenant_id_fkey;
create index idx_potensi_desa_tenant_id on potensi_desa (tenant_id);

drop policy "potensi_desa_staff_write" on potensi_desa;
create policy "potensi_desa_staff_write" on potensi_desa for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── statistik_sektor_usaha ──────────────────────────────────────────────
alter table statistik_sektor_usaha add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table statistik_sektor_usaha add constraint statistik_sektor_usaha_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table statistik_sektor_usaha validate constraint statistik_sektor_usaha_tenant_id_fkey;
alter table statistik_sektor_usaha drop constraint statistik_sektor_usaha_jenis_kode_key;
alter table statistik_sektor_usaha add constraint statistik_sektor_usaha_tenant_jenis_kode_key unique (tenant_id, jenis, kode);

drop policy "statistik_sektor_usaha_staff_write" on statistik_sektor_usaha;
create policy "statistik_sektor_usaha_staff_write" on statistik_sektor_usaha for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));

-- ── wilayah_rt (tidak ada write policy — dibiarkan, manual SQL only) ────
alter table wilayah_rt add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table wilayah_rt add constraint wilayah_rt_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table wilayah_rt validate constraint wilayah_rt_tenant_id_fkey;
alter table wilayah_rt drop constraint wilayah_rt_nomor_key;
alter table wilayah_rt add constraint wilayah_rt_tenant_nomor_key unique (tenant_id, nomor);
-- Target composite FK untuk statistik_rt di bawah.
alter table wilayah_rt add constraint wilayah_rt_tenant_id_id_key unique (tenant_id, id);

-- ── statistik_rt (FK composite ke wilayah_rt, harus satu tenant yang sama) ─
alter table statistik_rt add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table statistik_rt add constraint statistik_rt_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table statistik_rt validate constraint statistik_rt_tenant_id_fkey;

alter table statistik_rt drop constraint statistik_rt_rt_id_fkey;
alter table statistik_rt add constraint statistik_rt_tenant_rt_fkey
  foreign key (tenant_id, rt_id) references wilayah_rt (tenant_id, id) on delete cascade not valid;
alter table statistik_rt validate constraint statistik_rt_tenant_rt_fkey;

alter table statistik_rt drop constraint statistik_rt_category_rt_id_key;
alter table statistik_rt add constraint statistik_rt_tenant_category_rt_id_key unique (tenant_id, category, rt_id);

drop policy "statistik_rt_staff_write" on statistik_rt;
create policy "statistik_rt_staff_write" on statistik_rt for all using (is_tenant_staff(tenant_id)) with check (is_tenant_staff(tenant_id));
