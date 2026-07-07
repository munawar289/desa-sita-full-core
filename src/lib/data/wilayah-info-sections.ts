import type { WilayahInfoPage } from "./wilayah-info";

// Preset section baku (sejarah, batas wilayah, iklim, orbitasi) yang selalu
// ditampilkan sebagai kartu tetap di /admin/wilayah (dengan label & tempat
// terisi otomatis) supaya admin tidak perlu mengisi page/judul/eyebrow
// manual untuk section umum ini. Halaman publik TIDAK bergantung pada daftar
// ini — ia hanya fetch wilayah_info & filter by kolom `page` milik tiap
// baris, jadi section custom yang dibuat admin lewat "Tambah Section" (yang
// mengisi page/judul/eyebrow sendiri) otomatis ikut tampil tanpa perlu
// menambah entri di sini.
export type WilayahInfoPreset = {
  key: string;
  label: string;
  page: WilayahInfoPage;
  eyebrow: string;
  judul: string;
  urutan: number;
};

export const WILAYAH_INFO_PRESETS: WilayahInfoPreset[] = [
  { key: "sejarah", label: "Narasi Sejarah", page: "sejarah", eyebrow: "Narasi", judul: "Sejarah Desa Sita", urutan: 0 },
  { key: "batas_wilayah", label: "Batas Wilayah", page: "wilayah", eyebrow: "Geografi", judul: "Batas Wilayah", urutan: 0 },
  { key: "iklim", label: "Iklim", page: "wilayah", eyebrow: "Cuaca", judul: "Iklim", urutan: 1 },
  { key: "orbitasi", label: "Orbitasi", page: "wilayah", eyebrow: "Jarak Tempuh", judul: "Orbitasi", urutan: 2 },
];
