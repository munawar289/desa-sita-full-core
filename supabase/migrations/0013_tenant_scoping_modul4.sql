-- Phase 4 Modul 4 — tabel sensitif: audit_log (tenant_id + RLS) dan pengaduan
-- (skema saja, fungsionalitas tetap di luar scope — lihat PRD phase4 §4/§7
-- Modul 4). Pola identik migrasi 0011/0012.

-- ── audit_log ───────────────────────────────────────────────────────────
alter table audit_log add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table audit_log add constraint audit_log_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table audit_log validate constraint audit_log_tenant_id_fkey;
create index idx_audit_log_tenant_id on audit_log (tenant_id);

drop policy "audit_log_admin_read" on audit_log;
create policy "audit_log_admin_read"
  on audit_log for select
  using (is_tenant_admin(tenant_id));

-- Perbaikan bug lama (di luar tenant_id, tapi ditemukan saat riset migrasi
-- ini): tidak pernah ada policy INSERT untuk audit_log sama sekali — komentar
-- 0002_rls.sql menyebut "tulis lewat trigger (security definer)" tapi trigger
-- itu tidak pernah dibuat, sementara logAudit() (src/lib/actions/audit.ts)
-- menulis langsung lewat sesi admin biasa. Tanpa policy ini, RLS default-deny
-- membuat SEMUA insert audit log gagal senyap (error tidak dicek di kode).
create policy "audit_log_tenant_staff_insert"
  on audit_log for insert
  with check (is_tenant_staff(tenant_id));

-- ── pengaduan (skema tenant-ready saja, fungsionalitas belum dibangun) ───
alter table pengaduan add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table pengaduan add constraint pengaduan_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table pengaduan validate constraint pengaduan_tenant_id_fkey;
create index idx_pengaduan_tenant_id on pengaduan (tenant_id);

-- Insert publik (anonim) tetap tidak berubah — belum ada form/Server Action
-- yang mengirim tenant_id secara eksplisit, kolom baru ini mengandalkan
-- default konstan untuk baris yang mungkin (belum) masuk lewat form dummy.
drop policy "pengaduan_staff_read" on pengaduan;
create policy "pengaduan_staff_read"
  on pengaduan for select
  using (is_tenant_staff(tenant_id));

drop policy "pengaduan_staff_update" on pengaduan;
create policy "pengaduan_staff_update"
  on pengaduan for update
  using (is_tenant_staff(tenant_id));
