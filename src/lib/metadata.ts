import type { Metadata } from "next";
import { getDesaProfil } from "@/lib/queries/desa-profil";
import type { DesaProfil } from "@/lib/data/desa-profil";

type BuildMetadataOptions = {
  title?: string;
  description?: string | ((profil: DesaProfil) => string);
  robots?: Metadata["robots"];
  /** "admin" menyisipkan kata "Admin" ke suffix judul — dashboard, bukan situs publik. */
  area?: "publik" | "admin";
};

// Dipakai oleh generateMetadata() di root layout + tiap halaman — hanya
// bagian nama desa yang dinamis, judul/deskripsi spesifik per halaman tetap
// dipertahankan lewat opts.title/opts.description (PRD profil-desa §4.2).
export async function buildMetadata(opts: BuildMetadataOptions = {}): Promise<Metadata> {
  const profil = await getDesaProfil();
  const isAdmin = opts.area === "admin";

  const titleSuffix = isAdmin ? `Admin Desa ${profil.nama_desa}` : `Desa ${profil.nama_desa}`;
  const title = opts.title
    ? `${opts.title} — ${titleSuffix}`
    : isAdmin
      ? titleSuffix
      : `Desa ${profil.nama_desa} — Kec. ${profil.kecamatan}, Kab. ${profil.kabupaten}`;

  const description =
    typeof opts.description === "function"
      ? opts.description(profil)
      : (opts.description ??
        `Situs resmi Desa ${profil.nama_desa}, Kecamatan ${profil.kecamatan}, Kabupaten ${profil.kabupaten}, ${profil.provinsi}.`);

  return {
    title,
    description,
    ...(opts.robots ? { robots: opts.robots } : {}),
  };
}
