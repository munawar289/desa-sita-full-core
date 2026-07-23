import type { Metadata } from "next";
import Link from "next/link";
import { StatistikGroupedList } from "@/components/admin/StatistikGroupedList";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import type { Statistik } from "@/lib/data/statistik";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Statistik",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

export default async function AdminStatistikPage() {
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("statistik")
    .select("id, category, key, label, value, updated_at")
    .eq("tenant_id", tenant.id)
    .order("category")
    .order("key");

  const rows: Statistik[] = error ? [] : data;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text">Statistik</h1>
          <p className="mt-1 text-sm text-text-muted">
            Perubahan langsung tampil di situs publik (revalidasi otomatis).
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            href="/admin/statistik/per-rt"
            className="rounded-full border border-border px-4 py-2 font-medium text-link transition-colors duration-200 hover:bg-primary-soft/50"
          >
            Statistik per-RT
          </Link>
          <Link
            href="/admin/statistik/sektor-usaha"
            className="rounded-full border border-border px-4 py-2 font-medium text-link transition-colors duration-200 hover:bg-primary-soft/50"
          >
            Sektor Usaha
          </Link>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-on-danger-soft">
          Gagal memuat data statistik.
        </p>
      )}

      {!error && rows.length === 0 && (
        <p className="text-sm text-text-muted">Belum ada data statistik.</p>
      )}

      {!error && rows.length > 0 && <StatistikGroupedList rows={rows} />}
    </div>
  );
}
