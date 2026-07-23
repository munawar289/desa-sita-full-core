import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  PauseCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateTenantForm } from "@/components/platform/CreateTenantForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantWebsite } from "@/lib/tenant/website";

export const metadata: Metadata = {
  title: "Daftar Tenant — Panel Platform",
  robots: { index: false, follow: false },
};

export default async function PlatformDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("id, slug, domain, nama, status, created_at")
    .order("created_at", { ascending: false });

  const tenants = error ? [] : data;
  const totalTenant = tenants.length;
  const tenantAktif = tenants.filter((tenant) => tenant.status === "active").length;
  const tenantNonaktif = totalTenant - tenantAktif;

  const stats = [
    {
      label: "Total Tenant",
      value: totalTenant,
      icon: Building2,
      iconBg: "bg-plat-primary-container",
      iconColor: "text-plat-on-primary-container",
    },
    {
      label: "Aktif",
      value: tenantAktif,
      icon: CheckCircle2,
      iconBg: "bg-success-soft",
      iconColor: "text-on-success-soft",
    },
    {
      label: "Nonaktif",
      value: tenantNonaktif,
      icon: PauseCircle,
      iconBg: "bg-danger-soft",
      iconColor: "text-on-danger-soft",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-plat-secondary">
          <span className="size-1.5 rounded-full bg-plat-on-tertiary-container" aria-hidden />
          Manajemen Tenant
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-plat-on-surface">
          Daftar Tenant
        </h1>
        <p className="mt-1 text-sm text-plat-on-surface-variant">
          Kelola tenant (desa) yang terdaftar di platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-plat-outline-variant bg-plat-surface-container-lowest p-4"
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor}`}
            >
              <stat.icon className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <p className="font-mono text-2xl font-semibold tabular-nums text-plat-on-surface">
                {stat.value}
              </p>
              <p className="text-sm text-plat-on-surface-variant">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-plat-outline-variant bg-plat-surface-container-lowest p-4 sm:p-5">
        <h2 className="mb-4 font-heading text-sm font-semibold text-plat-on-surface">
          Buat Tenant Baru
        </h2>
        <CreateTenantForm />
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-danger-soft px-4 py-3 text-sm text-on-danger-soft">
          <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          <p>Gagal memuat daftar tenant. Coba muat ulang halaman.</p>
        </div>
      )}

      {!error && tenants.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-plat-outline-variant bg-plat-surface-container-lowest px-4 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-plat-surface-container-high text-plat-on-surface-variant">
            <Building2 className="size-6" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="font-heading text-sm font-semibold text-plat-on-surface">
            Belum ada tenant
          </p>
          <p className="max-w-sm text-sm text-plat-on-surface-variant">
            Tenant yang dibuat lewat form di atas akan muncul di sini.
          </p>
        </div>
      )}

      {!error && tenants.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-plat-outline-variant bg-plat-surface-container-lowest">
          <Table>
            <TableHeader>
              <TableRow className="border-plat-outline-variant hover:bg-transparent">
                <TableHead className="text-plat-on-surface-variant">Tenant</TableHead>
                <TableHead className="hidden text-plat-on-surface-variant sm:table-cell">
                  Situs
                </TableHead>
                <TableHead className="text-plat-on-surface-variant">Status</TableHead>
                <TableHead className="hidden text-plat-on-surface-variant md:table-cell">
                  Dibuat
                </TableHead>
                <TableHead className="text-right text-plat-on-surface-variant">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => {
                const website = getTenantWebsite(tenant);
                return (
                  <TableRow
                    key={tenant.id}
                    className="border-plat-outline-variant hover:bg-plat-surface-container-low"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-plat-primary-container text-plat-on-primary-container">
                          <Building2 className="size-4" strokeWidth={1.75} aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-plat-on-surface">
                            {tenant.nama}
                          </p>
                          <p className="truncate font-mono text-xs text-plat-on-surface-variant">
                            {tenant.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {website ? (
                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-plat-primary hover:underline"
                        >
                          {website.host}
                          <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden />
                        </a>
                      ) : (
                        <span className="text-xs text-plat-on-surface-variant/70">
                          Belum ada domain
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          tenant.status === "active"
                            ? "gap-1.5 border-transparent bg-success-soft text-on-success-soft"
                            : "gap-1.5 border-transparent bg-danger-soft text-on-danger-soft"
                        }
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            tenant.status === "active" ? "bg-on-success-soft" : "bg-on-danger-soft"
                          }`}
                          aria-hidden
                        />
                        {tenant.status === "active" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs tabular-nums text-plat-on-surface-variant md:table-cell">
                      {new Date(tenant.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/platform/dashboard/tenants/${tenant.id}`}
                        className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-medium text-plat-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plat-primary"
                      >
                        Kelola
                        <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
