import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { getKepalaDesaRiwayat } from "@/lib/queries/kepala-desa-riwayat";
import { getWilayahInfo } from "@/lib/queries/wilayah-info";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Sejarah",
    description: (profil) =>
      `Riwayat berdirinya Desa ${profil.nama_desa} dan daftar kepala desa dari masa ke masa.`,
  });
}

export const revalidate = 300;

export default async function SejarahPage() {
  const [kepalaDesaRiwayat, wilayahInfo] = await Promise.all([
    getKepalaDesaRiwayat(),
    getWilayahInfo(),
  ]);
  const riwayat = [...kepalaDesaRiwayat].sort((a, b) => a.urutan - b.urutan);
  const narrativeSections = wilayahInfo
    .filter((item) => item.page === "sejarah")
    .sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      <PageHeader
        title="Sejarah"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Profil Desa", href: "/profil-desa" },
          { label: "Sejarah" },
        ]}
      />

      <div className="mx-auto max-w-4xl space-y-16 px-4 py-12 sm:px-6">
        {narrativeSections.map((item) => (
          <section key={item.id}>
            <SectionHeader eyebrow={item.eyebrow} title={item.judul} />
            <div className="prose prose-stone mt-6 max-w-none text-espresso-800">
              <p>{item.konten}</p>
            </div>
          </section>
        ))}

        <section>
          <SectionHeader eyebrow="Kepemimpinan" title="Daftar Kepala Desa" />
          <div className="mt-8">
            {riwayat.length === 0 ? (
              <EmptyState icon={<FileQuestion />} message="Belum ada data tersedia" />
            ) : (
              <ol className="relative space-y-8 border-l border-kakao-200 pl-6">
                {riwayat.map((item) => (
                  <li key={item.id} className="relative">
                    <span className="absolute -left-[1.65rem] top-1 size-3 rounded-full bg-kopi-600" />
                    <p className="text-sm font-semibold text-kopi-600">
                      {item.periode_mulai} &ndash; {item.periode_selesai ?? "Sekarang"}
                    </p>
                    <p className="font-heading text-lg font-semibold text-espresso-950">
                      {item.nama}
                    </p>
                    {item.keterangan && (
                      <p className="text-sm text-espresso-800/60">{item.keterangan}</p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
