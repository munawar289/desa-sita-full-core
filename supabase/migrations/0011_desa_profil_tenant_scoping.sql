-- Phase 4 Modul 2 — Sambungkan desa_profil ke tenant context (proving ground).
-- desa_profil sudah punya 1 baris (seed tenant default), jadi FK/unique aman
-- divalidasi langsung — tetap pakai teknik NOT VALID + VALIDATE (PRD §8) untuk
-- kebiasaan yang benar walau skala data di sini kecil.

alter table desa_profil
  add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';

alter table desa_profil
  add constraint desa_profil_tenant_id_fkey
  foreign key (tenant_id) references tenants(id) not valid;

alter table desa_profil
  validate constraint desa_profil_tenant_id_fkey;

-- Singleton per tenant — mengeraskan asumsi lama (.limit(1).single()) jadi
-- constraint DB yang sesungguhnya, sekaligus index untuk filter tenant_id.
alter table desa_profil
  add constraint desa_profil_tenant_id_unique unique (tenant_id);

-- ── RLS: tulis tetap admin-only (bukan staff), tapi scoped per tenant ───────
drop policy "desa_profil_admin_write" on desa_profil;

create policy "desa_profil_admin_write"
  on desa_profil for update
  using (is_tenant_admin(tenant_id))
  with check (is_tenant_admin(tenant_id));

-- ── Provisioning: tenant baru otomatis dapat baris desa_profil default ─────
-- Tanpa ini, getDesaProfil() tenant baru dapat 0 baris dan withSupabaseFallback
-- diam-diam menyajikan desaProfilMock (identitas desa lain) ke pengunjung.
-- Pola sama seperti handle_new_user() di 0003_triggers.sql.
create or replace function public.create_default_desa_profil_for_tenant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.desa_profil (
    tenant_id, nama_desa, kecamatan, kabupaten, provinsi, hero_deskripsi
  ) values (
    new.id, new.nama, '-', '-', '-', 'Profil desa ini belum dilengkapi.'
  );
  return new;
end;
$$;

create trigger on_tenant_created_desa_profil
  after insert on tenants
  for each row execute function public.create_default_desa_profil_for_tenant();
