-- Phase 4 Modul 1 — Helper RLS tenant-scoped (fondasi, dikerjakan sekali).
-- Tambahan, TIDAK mengganti is_admin()/is_staff()/current_user_role() existing
-- (0002_rls.sql) — helper lama masih dipakai tabel yang belum dimigrasi ke
-- tenant_id. Pola security definer + search_path persis sama seperti is_staff().

create or replace function public.is_tenant_member(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from memberships
    where tenant_id = target_tenant_id and profile_id = auth.uid()
  );
$$;

create or replace function public.is_tenant_staff(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from memberships
    where tenant_id = target_tenant_id and profile_id = auth.uid()
      and role in ('admin', 'operator')
  );
$$;

create or replace function public.is_tenant_admin(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from memberships
    where tenant_id = target_tenant_id and profile_id = auth.uid()
      and role = 'admin'
  );
$$;
