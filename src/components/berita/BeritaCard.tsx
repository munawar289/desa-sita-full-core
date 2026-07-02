import Image from "next/image";
import Link from "next/link";
import { BadgeKategori } from "@/components/shared/BadgeKategori";
import type { Berita } from "@/lib/data/berita";

function formatTanggal(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BeritaCard({ berita }: { berita: Berita }) {
  return (
    <Link
      href={`/berita/${berita.slug}`}
      className="group block overflow-hidden rounded-xl border border-kakao-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-kakao-100">
        {berita.cover_image_url ? (
          <Image
            src={berita.cover_image_url}
            alt={berita.judul}
            fill
            className="object-cover transition-all duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-kopi-100 to-kakao-100 text-sm text-espresso-800/40">
            Desa Sita
          </div>
        )}
      </div>
      <div className="p-4">
        {berita.kategori && (
          <BadgeKategori
            label={berita.kategori}
            tone={berita.kategori === "Pengumuman" ? "sawah" : "kopi"}
          />
        )}
        <h3 className="mt-2 font-heading text-lg font-semibold text-espresso-950 group-hover:text-kopi-600">
          {berita.judul}
        </h3>
        {berita.ringkasan && (
          <p className="mt-1 line-clamp-2 text-sm text-espresso-800/70">
            {berita.ringkasan}
          </p>
        )}
        <p className="mt-3 text-xs text-espresso-800/50">
          {formatTanggal(berita.published_at)}
        </p>
      </div>
    </Link>
  );
}
