-- Fondasi multi-tenant (Phase 3 — infrastruktur murni). Tabel bisnis existing
-- TIDAK disentuh. Tujuan: tabel tenants + memberships, RLS, dan satu tenant
-- default supaya admin & situs existing tidak kehilangan akses/berubah perilaku.

create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  domain text unique,
  nama text not null,
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenants_slug_format check (slug ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'),
  constraint tenants_slug_lowercase check (slug = lower(slug)),
  constraint tenants_domain_lowercase check (domain is null or domain = lower(domain))
);

create trigger set_updated_at_tenants
  before update on tenants
  for each row execute function set_updated_at();

create table memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  -- Duplikasi sengaja dengan profiles.role selama masa transisi — lihat PRD §4.1.
  role text not null check (role in ('admin', 'operator')) default 'operator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_id)
);

create index idx_memberships_profile_id on memberships (profile_id);

create trigger set_updated_at_memberships
  before update on memberships
  for each row execute function set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────
alter table tenants enable row level security;

create policy "tenants_public_read"
  on tenants for select
  using (true); -- perlu di-resolve dari anon client (publik & middleware)

create policy "tenants_admin_write"
  on tenants for all
  using (is_admin())
  with check (is_admin());

alter table memberships enable row level security;

create policy "memberships_select_own_or_admin"
  on memberships for select
  using (profile_id = auth.uid() or is_admin());

create policy "memberships_admin_write"
  on memberships for all
  using (is_admin())
  with check (is_admin());

-- ── Seed tenant default + backfill membership ────────────────────────────
-- id KONSTAN (bukan gen_random_uuid()) — harus sama persis dengan
-- src/lib/tenant/constants.ts DEFAULT_TENANT_ID, supaya resolver bisa
-- memakainya lewat fast-path tanpa query DB untuk domain produksi saat ini.
insert into tenants (id, slug, domain, nama, status) values (
  '00000000-0000-0000-0000-000000000001',
  'sita',
  null,
  'Desa Sita',
  'active'
);

insert into memberships (tenant_id, profile_id, role)
select '00000000-0000-0000-0000-000000000001', id, role
from profiles
on conflict (tenant_id, profile_id) do nothing;
