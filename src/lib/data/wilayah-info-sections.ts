// Section baku yang dipakai halaman publik /profil-desa/sejarah &
// /profil-desa/wilayah — ditampilkan sebagai kartu tetap di /admin/wilayah
// (dengan label ramah) supaya admin tidak perlu tahu/menebak nama key-nya.
// Admin tetap bisa menambah section custom lain lewat "Tambah Section".
export const WILAYAH_INFO_SECTIONS: { key: string; label: string }[] = [
  { key: "sejarah", label: "Narasi Sejarah" },
  { key: "batas_wilayah", label: "Batas Wilayah" },
  { key: "iklim", label: "Iklim" },
  { key: "orbitasi", label: "Orbitasi" },
];

export function labelForSection(key: string): string {
  return WILAYAH_INFO_SECTIONS.find((s) => s.key === key)?.label ?? key;
}
