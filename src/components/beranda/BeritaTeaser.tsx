import Link from "next/link";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { BeritaGrid } from "@/components/berita/BeritaGrid";
import { getBerita } from "@/lib/queries/berita";

export async function BeritaTeaser() {
  const berita = await getBerita();
  const terbaru = berita.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeader eyebrow="Info Terkini" title="Berita Terbaru" />

      <div className="mt-8">
        <BeritaGrid items={terbaru} />
      </div>

      <div className="mt-8 text-center">
        <Button
          asChild
          variant="outline"
          className="rounded-lg border-kopi-600 text-kopi-600 hover:bg-kopi-100 hover:text-kopi-600"
        >
          <Link href="/berita">Lihat Semua Berita &rarr;</Link>
        </Button>
      </div>
    </section>
  );
}
