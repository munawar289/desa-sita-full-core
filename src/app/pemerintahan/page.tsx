import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatTable } from "@/components/statistik/StatTable";
import { StrukturOrganisasi } from "@/components/pemerintahan/StrukturOrganisasi";
import { getAparatur } from "@/lib/queries/aparatur";
import { getBpd } from "@/lib/queries/bpd";

export const metadata: Metadata = {
  title: "Pemerintahan — Desa Sita",
  description: "Struktur organisasi dan Badan Permusyawaratan Desa (BPD) Desa Sita.",
};

export const revalidate = 300;

export default async function PemerintahanPage() {
  const [aparatur, bpdAnggota] = await Promise.all([getAparatur(), getBpd()]);
  const bpd = [...bpdAnggota].sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      <PageHeader
        title="Pemerintahan"
        breadcrumbItems={[{ label: "Beranda", href: "/" }, { label: "Pemerintahan" }]}
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6">
        <section>
          <SectionHeader
            eyebrow="Struktur Organisasi"
            title="Perangkat Desa Sita"
            align="center"
            className="mx-auto"
          />
          <div className="mt-10">
            <StrukturOrganisasi data={aparatur} />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="BPD" title="Badan Permusyawaratan Desa" />
          <div className="mt-6">
            {bpd.length > 0 ? (
              <StatTable
                columns={[
                  { key: "nama", label: "Nama" },
                  { key: "jabatan", label: "Jabatan" },
                  { key: "pendidikan", label: "Pendidikan" },
                ]}
                rows={bpd}
              />
            ) : (
              <EmptyState icon={<FileQuestion />} message="Belum ada data tersedia" />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
