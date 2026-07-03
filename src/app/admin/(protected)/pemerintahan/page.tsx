import type { Metadata } from "next";
import { AddAparaturForm } from "@/components/admin/AddAparaturForm";
import { AparaturRow } from "@/components/admin/AparaturRow";
import { AddBpdForm } from "@/components/admin/AddBpdForm";
import { BpdRow } from "@/components/admin/BpdRow";
import { AddKepalaDesaForm } from "@/components/admin/AddKepalaDesaForm";
import { KepalaDesaRow } from "@/components/admin/KepalaDesaRow";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Aparatur } from "@/lib/data/aparatur";
import type { BpdAnggota } from "@/lib/data/bpd";
import type { KepalaDesaRiwayat } from "@/lib/data/kepala-desa-riwayat";

export const metadata: Metadata = {
  title: "Pemerintahan — Admin Desa Sita",
  robots: { index: false, follow: false },
};

export default async function AdminPemerintahanPage() {
  const supabase = await createSupabaseServerClient();
  const [aparaturResult, bpdResult, kepalaDesaResult] = await Promise.all([
    supabase.from("aparatur").select("id, nama, jabatan, pendidikan, urutan").order("urutan"),
    supabase.from("bpd_anggota").select("id, nama, jabatan, pendidikan, urutan").order("urutan"),
    supabase
      .from("kepala_desa_riwayat")
      .select("id, nama, periode_mulai, periode_selesai, keterangan, urutan")
      .order("urutan"),
  ]);

  const aparatur: Aparatur[] = aparaturResult.error ? [] : aparaturResult.data;
  const bpd: BpdAnggota[] = bpdResult.error ? [] : bpdResult.data;
  const kepalaDesa: KepalaDesaRiwayat[] = kepalaDesaResult.error ? [] : kepalaDesaResult.data;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-espresso-950">Pemerintahan</h1>
        <p className="mt-1 text-sm text-espresso-800/60">
          Perubahan langsung tampil di halaman publik /pemerintahan dan /profil-desa/sejarah.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-sawah-700">
          Struktur Organisasi (Aparatur)
        </h2>
        {aparaturResult.error ? (
          <p className="rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
            Gagal memuat data aparatur.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-kakao-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-kakao-100">
                <tr>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Nama
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Jabatan
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Pendidikan
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Urutan
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {aparatur.map((item) => (
                  <AparaturRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AddAparaturForm />
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-sawah-700">
          Badan Permusyawaratan Desa (BPD)
        </h2>
        {bpdResult.error ? (
          <p className="rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
            Gagal memuat data BPD.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-kakao-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-kakao-100">
                <tr>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Nama
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Jabatan
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Pendidikan
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {bpd.map((item) => (
                  <BpdRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AddBpdForm />
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-sawah-700">
          Riwayat Kepala Desa
        </h2>
        {kepalaDesaResult.error ? (
          <p className="rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
            Gagal memuat data riwayat kepala desa.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-kakao-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-kakao-100">
                <tr>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Nama
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Mulai
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Selesai
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Keterangan
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Urutan
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {kepalaDesa.map((item) => (
                  <KepalaDesaRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AddKepalaDesaForm />
      </section>
    </div>
  );
}
