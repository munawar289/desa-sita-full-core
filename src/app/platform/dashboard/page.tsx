import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Daftar Tenant — Panel Platform",
  robots: { index: false, follow: false },
};

export default async function PlatformDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("id, slug, nama, status, created_at")
    .order("created_at", { ascending: false });

  const tenants = error ? [] : data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-plat-on-surface">
          Daftar Tenant
        </h1>
        <p className="mt-1 text-sm text-plat-on-surface-variant">
          Kelola tenant (desa) yang terdaftar di platform.
        </p>
      </div>

      <section className="rounded-xl border border-plat-outline-variant bg-plat-surface-container-lowest p-4">
        <h2 className="mb-3 font-heading text-sm font-semibold text-plat-on-surface">
          Buat Tenant Baru
        </h2>
        <CreateTenantForm />
      </section>

      {error && (
        <p className="rounded-lg bg-plat-error-container px-4 py-3 text-sm text-plat-on-error-container">
          Gagal memuat daftar tenant.
        </p>
      )}

      {!error && tenants.length === 0 && (
        <p className="text-sm text-plat-on-surface-variant">Belum ada tenant.</p>
      )}

      {!error && tenants.length > 0 && (
        <div className="rounded-xl border border-plat-outline-variant bg-plat-surface-container-lowest">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium text-plat-on-surface">{tenant.nama}</TableCell>
                  <TableCell>{tenant.slug}</TableCell>
                  <TableCell>
                    <Badge variant={tenant.status === "active" ? "secondary" : "destructive"}>
                      {tenant.status === "active" ? "Aktif" : "Suspended"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(tenant.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/platform/dashboard/tenants/${tenant.id}`}
                      className="text-sm font-medium text-plat-primary underline underline-offset-4 hover:text-plat-primary/80"
                    >
                      Kelola
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
