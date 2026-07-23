import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Building2, Calendar, ShieldAlert, ShieldCheck, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InviteAdminForm } from "@/components/platform/InviteAdminForm";
import { RemoveAdminButton } from "@/components/platform/RemoveAdminButton";
import { SuspendTenantButton } from "@/components/platform/SuspendTenantButton";
import { getTenantAdmins } from "@/lib/actions/platform-tenants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantWebsite } from "@/lib/tenant/website";

export const metadata: Metadata = {
  title: "Detail Tenant — Panel Platform",
  robots: { index: false, follow: false },
};

export default async function PlatformTenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, slug, domain, nama, status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!tenant) notFound();

  const isActive = tenant.status === "active";
  const nextStatus = isActive ? "suspended" : "active";
  const website = getTenantWebsite(tenant);
  const admins = await getTenantAdmins(tenant.id);

  return (
    <div className="space-y-8">
      <Link
        href="/platform/dashboard"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-plat-on-surface-variant transition-colors hover:text-plat-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plat-primary"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
        Kembali ke Daftar Tenant
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-plat-outline-variant bg-plat-surface-container-lowest p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-plat-primary-container text-plat-on-primary-container">
            <Building2 className="size-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold text-plat-on-surface">
              {tenant.nama}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-plat-on-surface-variant">
              <span className="font-mono text-xs">{tenant.slug}</span>
              <span className="inline-flex items-center gap-1 text-xs">
                <Calendar className="size-3.5" strokeWidth={1.75} aria-hidden />
                Dibuat{" "}
                {new Date(tenant.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {website && (
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-plat-primary hover:underline"
                >
                  {website.host}
                  <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden />
                </a>
              )}
            </div>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isActive
              ? "gap-1.5 border-transparent bg-success-soft text-on-success-soft"
              : "gap-1.5 border-transparent bg-danger-soft text-on-danger-soft"
          }
        >
          <span
            className={`size-1.5 rounded-full ${isActive ? "bg-on-success-soft" : "bg-on-danger-soft"}`}
            aria-hidden
          />
          {isActive ? "Aktif" : "Suspended"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="flex flex-col rounded-xl border border-plat-outline-variant bg-plat-surface-container-lowest p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2.5">
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                isActive ? "bg-danger-soft text-on-danger-soft" : "bg-success-soft text-on-success-soft"
              }`}
            >
              {isActive ? (
                <ShieldAlert className="size-4" strokeWidth={1.75} aria-hidden />
              ) : (
                <ShieldCheck className="size-4" strokeWidth={1.75} aria-hidden />
              )}
            </span>
            <h2 className="font-heading text-sm font-semibold text-plat-on-surface">Status Tenant</h2>
          </div>
          <p className="mb-4 text-sm text-plat-on-surface-variant">
            Suspend memblokir akses dashboard admin tenant ini; situs publiknya tetap tampil
            normal.
          </p>
          <div className="mt-auto">
            <SuspendTenantButton tenantId={tenant.id} tenantName={tenant.nama} nextStatus={nextStatus} />
          </div>
        </section>

        <section className="flex flex-col rounded-xl border border-plat-outline-variant bg-plat-surface-container-lowest p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-plat-primary-container text-plat-on-primary-container">
              <Users className="size-4" strokeWidth={1.75} aria-hidden />
            </span>
            <h2 className="font-heading text-sm font-semibold text-plat-on-surface">
              Admin Tenant
              {admins.length > 0 && (
                <span className="ml-1.5 font-mono text-xs font-normal text-plat-on-surface-variant">
                  ({admins.length})
                </span>
              )}
            </h2>
          </div>

          {admins.length === 0 ? (
            <p className="text-sm text-plat-on-surface-variant">Belum ada admin ditambahkan.</p>
          ) : (
            <ul className="-my-2.5 divide-y divide-plat-outline-variant">
              {admins.map((admin) => (
                <li key={admin.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-plat-secondary-container text-xs font-semibold text-plat-on-secondary-container uppercase">
                      {admin.namaLengkap.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-plat-on-surface">
                        {admin.namaLengkap}
                      </p>
                      <p className="text-xs text-plat-on-surface-variant">
                        Bergabung {new Date(admin.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge
                      variant="outline"
                      className="border-transparent bg-plat-surface-container-high text-plat-on-surface-variant"
                    >
                      {admin.role === "admin" ? "Admin" : "Operator"}
                    </Badge>
                    <RemoveAdminButton
                      tenantId={tenant.id}
                      membershipId={admin.id}
                      adminName={admin.namaLengkap}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col rounded-xl border border-plat-outline-variant bg-plat-surface-container-lowest p-4 sm:p-5 lg:col-span-2">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-plat-primary-container text-plat-on-primary-container">
              <UserPlus className="size-4" strokeWidth={1.75} aria-hidden />
            </span>
            <h2 className="font-heading text-sm font-semibold text-plat-on-surface">Tambah Admin</h2>
          </div>
          <p className="mb-4 text-sm text-plat-on-surface-variant">
            Akun langsung dibuat aktif dengan email &amp; kata sandi di bawah — tanpa email
            verifikasi. Kalau emailnya sudah terdaftar, akun tersebut langsung ditambahkan
            sebagai admin tenant ini (kata sandi yang sudah ada tidak berubah).
          </p>
          <InviteAdminForm tenantId={tenant.id} />
        </section>
      </div>
    </div>
  );
}
