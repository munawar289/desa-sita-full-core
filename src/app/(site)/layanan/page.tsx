import Link from "next/link";
import type { Metadata } from "next";
import { Clock, ClipboardList, MessageSquareWarning } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Layanan",
    description: (profil) => `Informasi layanan operasional dan pengaduan Desa ${profil.nama_desa}.`,
  });
}

export default function LayananPage() {
  return (
    <>
      <PageHeader
        title="Layanan"
        breadcrumbItems={[{ label: "Beranda", href: "/" }, { label: "Layanan" }]}
      />

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6">
        <section>
          <SectionHeader eyebrow="Jam Operasional" title="Waktu Pelayanan Kantor Desa" />
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-surface p-5 shadow-sm">
            <Clock className="mt-0.5 size-6 shrink-0 text-primary" />
            <div className="text-sm text-text">
              <p className="font-semibold text-text">Senin &ndash; Jumat</p>
              <p className="text-text-muted">08.00 &ndash; 16.00 WITA</p>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Prosedur" title="Cara Mengurus Layanan" />
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-surface p-5 shadow-sm">
            <ClipboardList className="mt-0.5 size-6 shrink-0 text-primary" />
            <ol className="list-decimal space-y-1 pl-4 text-sm text-text">
              <li>Datang ke kantor desa pada jam operasional.</li>
              <li>Sampaikan keperluan Anda kepada petugas piket.</li>
              <li>Lengkapi berkas yang diminta sesuai jenis layanan.</li>
              <li>Tunggu proses selesai di kantor desa.</li>
            </ol>
          </div>
        </section>

        <section className="rounded-xl bg-secondary-soft p-6 text-center">
          <MessageSquareWarning className="mx-auto size-8 text-on-secondary-soft" />
          <h2 className="mt-3 font-heading text-xl font-semibold text-text">
            Punya keluhan atau masukan?
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Sampaikan lewat form pengaduan warga secara daring.
          </p>
          <Button
            asChild
            className="mt-4 rounded-lg"
          >
            <Link href="/layanan/pengaduan">Isi Form Pengaduan &rarr;</Link>
          </Button>
        </section>
      </div>
    </>
  );
}
