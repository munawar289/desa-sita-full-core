import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, FileText, MessageSquareWarning } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Ringkasan",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

const USANG_HARI = 90;

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AdminRingkasanPage() {
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const ambangUsang = new Date();
  ambangUsang.setDate(ambangUsang.getDate() - USANG_HARI);

  const [statistikUsangRes, pengaduanBaruRes, beritaTerakhirRes] = await Promise.all([
    supabase
      .from("statistik")
      .select("id, label, category, updated_at")
      .eq("tenant_id", tenant.id)
      .lt("updated_at", ambangUsang.toISOString())
      .order("updated_at"),
    supabase
      .from("pengaduan")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", tenant.id)
      .eq("status", "baru"),
    // `berita` belum tenant-scoped (belum ada kolom tenant_id) — di luar
    // cakupan audit ini, jangan tambah filter yang bikin query error.
    supabase
      .from("berita")
      .select("id, judul, status, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const statistikUsang = statistikUsangRes.data ?? [];
  const jumlahPengaduanBaru = pengaduanBaruRes.count ?? 0;
  const beritaTerakhir = beritaTerakhirRes.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-text">Ringkasan</h1>
        <p className="mt-1 text-sm text-text-muted">
          Kondisi data yang perlu perhatian hari ini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="size-5" />
            <p className="font-mono text-xs uppercase tracking-wider">Statistik Usang</p>
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold text-text">
            {statistikUsang.length}
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Belum diperbarui &gt; {USANG_HARI} hari
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-link">
            <MessageSquareWarning className="size-5" />
            <p className="font-mono text-xs uppercase tracking-wider">Pengaduan Baru</p>
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold text-text">
            {jumlahPengaduanBaru}
          </p>
          <p className="mt-1 text-sm text-text-muted">Menunggu ditindaklanjuti</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-text-muted">
            <FileText className="size-5" />
            <p className="font-mono text-xs uppercase tracking-wider">Berita Terakhir</p>
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold text-text">
            {beritaTerakhir.length}
          </p>
          <p className="mt-1 text-sm text-text-muted">3 entri terbaru</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-text">
          Statistik yang Perlu Diperbarui
        </h2>
        {statistikUsang.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">
            Semua data statistik masih dalam {USANG_HARI} hari terakhir.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {statistikUsang.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-text">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-muted">
                    {formatTanggal(item.updated_at)}
                  </span>
                  <Link
                    href="/admin/statistik"
                    className="text-sm font-semibold text-link hover:text-link-hover"
                  >
                    Perbarui →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-text">Berita Terakhir</h2>
        {beritaTerakhir.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">Belum ada berita.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {beritaTerakhir.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                <p className="font-medium text-text">{item.judul}</p>
                <span className="font-mono text-xs uppercase text-text-muted">
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
