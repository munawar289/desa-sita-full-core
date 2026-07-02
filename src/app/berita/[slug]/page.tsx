import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgeKategori } from "@/components/shared/BadgeKategori";
import { BeritaGrid } from "@/components/berita/BeritaGrid";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { beritaMock } from "@/lib/data/berita";

function formatTanggal(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function estimasiBaca(konten: string) {
  const jumlahKata = konten.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(jumlahKata / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const berita = beritaMock.find((item) => item.slug === slug);
  if (!berita) return { title: "Berita — Desa Sita" };
  return {
    title: `${berita.judul} — Desa Sita`,
    description: berita.ringkasan ?? undefined,
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const berita = beritaMock.find((item) => item.slug === slug && item.status === "published");

  if (!berita) {
    notFound();
  }

  const beritaLainnya = beritaMock
    .filter((item) => item.status === "published" && item.slug !== berita.slug)
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title={berita.judul}
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Berita", href: "/berita" },
          { label: berita.judul },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {berita.cover_image_url && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl sm:h-80">
            <Image
              src={berita.cover_image_url}
              alt={berita.judul}
              fill
              className="object-cover"
            />
          </div>
        )}

        {berita.kategori && (
          <BadgeKategori
            label={berita.kategori}
            tone={berita.kategori === "Pengumuman" ? "sawah" : "kopi"}
          />
        )}

        <h1 className="mt-3 font-heading text-3xl font-semibold text-espresso-950">
          {berita.judul}
        </h1>

        <p className="mt-2 text-sm text-espresso-800/60">
          {berita.author_nama ?? "Admin Desa"} &middot; {formatTanggal(berita.published_at)}{" "}
          &middot; {estimasiBaca(berita.konten)} menit baca
        </p>

        <div className="prose prose-stone mt-8 max-w-none text-espresso-800">
          <p>{berita.konten}</p>
        </div>
      </article>

      {beritaLainnya.length > 0 && (
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <SectionHeader title="Berita Lainnya" />
          <div className="mt-8">
            <BeritaGrid items={beritaLainnya} />
          </div>
        </div>
      )}
    </>
  );
}
