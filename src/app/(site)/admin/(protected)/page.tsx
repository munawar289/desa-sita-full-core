import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, FileText, MessageSquareWarning } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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
  const supabase = await createSupabaseServerClient();
  const ambangUsang = new Date();
  ambangUsang.setDate(ambangUsang.getDate() - USANG_HARI);

  const [statistikUsangRes, pengaduanBaruRes, beritaTerakhirRes] = await Promise.all([
    supabase
      .from("statistik")
      .select("id, label, category, updated_at")
      .lt("updated_at", ambangUsang.toISOString())
      .order("updated_at"),
    supabase.from("pengaduan").select("id", { count: "exact", head: true }).eq("status", "baru"),
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
        <h1 className="font-heading text-2xl font-semibold text-espresso-950">Ringkasan</h1>
        <p className="mt-1 text-sm text-espresso-800/60">
          Kondisi data yang perlu perhatian hari ini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-kakao-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-tanah-500">
            <AlertTriangle className="size-5" />
            <p className="font-mono text-xs uppercase tracking-wider">Statistik Usang</p>
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold text-espresso-950">
            {statistikUsang.length}
          </p>
          <p className="mt-1 text-sm text-espresso-800/60">
            Belum diperbarui &gt; {USANG_HARI} hari
          </p>
        </div>

        <div className="rounded-2xl border border-kakao-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-kopi-600">
            <MessageSquareWarning className="size-5" />
            <p className="font-mono text-xs uppercase tracking-wider">Pengaduan Baru</p>
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold text-espresso-950">
            {jumlahPengaduanBaru}
          </p>
          <p className="mt-1 text-sm text-espresso-800/60">Menunggu ditindaklanjuti</p>
        </div>

        <div className="rounded-2xl border border-kakao-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sawah-700">
            <FileText className="size-5" />
            <p className="font-mono text-xs uppercase tracking-wider">Berita Terakhir</p>
          </div>
          <p className="mt-3 font-mono text-3xl font-semibold text-espresso-950">
            {beritaTerakhir.length}
          </p>
          <p className="mt-1 text-sm text-espresso-800/60">3 entri terbaru</p>
        </div>
      </div>

      <div className="rounded-2xl border border-kakao-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-espresso-950">
          Statistik yang Perlu Diperbarui
        </h2>
        {statistikUsang.length === 0 ? (
          <p className="mt-3 text-sm text-espresso-800/60">
            Semua data statistik masih dalam {USANG_HARI} hari terakhir.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-kakao-200">
            {statistikUsang.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-espresso-950">{item.label}</p>
                  <p className="text-xs text-espresso-800/50">{item.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-espresso-800/50">
                    {formatTanggal(item.updated_at)}
                  </span>
                  <Link
                    href="/admin/statistik"
                    className="text-sm font-semibold text-kopi-600 hover:text-kopi-400"
                  >
                    Perbarui →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-kakao-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-espresso-950">Berita Terakhir</h2>
        {beritaTerakhir.length === 0 ? (
          <p className="mt-3 text-sm text-espresso-800/60">Belum ada berita.</p>
        ) : (
          <ul className="mt-4 divide-y divide-kakao-200">
            {beritaTerakhir.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                <p className="font-medium text-espresso-950">{item.judul}</p>
                <span className="font-mono text-xs uppercase text-espresso-800/50">
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
