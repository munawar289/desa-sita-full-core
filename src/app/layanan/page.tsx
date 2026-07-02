import Link from "next/link";
import type { Metadata } from "next";
import { Clock, ClipboardList, MessageSquareWarning } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Layanan — Desa Sita",
  description: "Informasi layanan operasional dan pengaduan Desa Sita.",
};

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
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-kakao-200 bg-white p-5 shadow-sm">
            <Clock className="mt-0.5 size-6 shrink-0 text-kopi-600" />
            <div className="text-sm text-espresso-800">
              <p className="font-semibold text-espresso-950">Senin &ndash; Jumat</p>
              <p className="text-espresso-800/70">08.00 &ndash; 16.00 WITA</p>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Prosedur" title="Cara Mengurus Layanan" />
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-kakao-200 bg-white p-5 shadow-sm">
            <ClipboardList className="mt-0.5 size-6 shrink-0 text-kopi-600" />
            <ol className="list-decimal space-y-1 pl-4 text-sm text-espresso-800">
              <li>Datang ke kantor desa pada jam operasional.</li>
              <li>Sampaikan keperluan Anda kepada petugas piket.</li>
              <li>Lengkapi berkas yang diminta sesuai jenis layanan.</li>
              <li>Tunggu proses selesai di kantor desa.</li>
            </ol>
          </div>
        </section>

        <section className="rounded-xl bg-sawah-100 p-6 text-center">
          <MessageSquareWarning className="mx-auto size-8 text-sawah-700" />
          <h2 className="mt-3 font-heading text-xl font-semibold text-espresso-950">
            Punya keluhan atau masukan?
          </h2>
          <p className="mt-1 text-sm text-espresso-800/70">
            Sampaikan lewat form pengaduan warga secara daring.
          </p>
          <Button
            asChild
            className="mt-4 rounded-lg bg-sawah-700 text-white hover:bg-sawah-700/90"
          >
            <Link href="/layanan/pengaduan">Isi Form Pengaduan &rarr;</Link>
          </Button>
        </section>
      </div>
    </>
  );
}
