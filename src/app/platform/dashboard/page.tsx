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
        <h1 className="font-heading text-2xl font-semibold text-espresso-950">
          Daftar Tenant
        </h1>
        <p className="mt-1 text-sm text-espresso-800/60">
          Kelola tenant (desa) yang terdaftar di platform.
        </p>
      </div>

      <section className="rounded-xl border border-kakao-200 bg-white p-4">
        <h2 className="mb-3 font-heading text-sm font-semibold text-espresso-950">
          Buat Tenant Baru
        </h2>
        <CreateTenantForm />
      </section>

      {error && (
        <p className="rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
          Gagal memuat daftar tenant.
        </p>
      )}

      {!error && tenants.length === 0 && (
        <p className="text-sm text-espresso-800/60">Belum ada tenant.</p>
      )}

      {!error && tenants.length > 0 && (
        <div className="rounded-xl border border-kakao-200 bg-white">
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
                  <TableCell className="font-medium text-espresso-950">{tenant.nama}</TableCell>
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
                      className="text-sm font-medium text-kopi-600 underline underline-offset-4 hover:text-kopi-600/80"
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
