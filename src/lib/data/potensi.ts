import { Beef, Factory, Fish, Landmark, Sprout, Store, Trees, Wheat } from "lucide-react";

// Ikon yang bisa dipilih admin untuk kartu potensi desa di beranda.
export const POTENSI_ICON_OPTIONS = [
  "Sprout",
  "Trees",
  "Beef",
  "Fish",
  "Wheat",
  "Store",
  "Factory",
  "Landmark",
] as const;

export type PotensiIcon = (typeof POTENSI_ICON_OPTIONS)[number];

export const potensiIconMap: Record<PotensiIcon, typeof Sprout> = {
  Sprout,
  Trees,
  Beef,
  Fish,
  Wheat,
  Store,
  Factory,
  Landmark,
};

export type Potensi = {
  id: string;
  judul: string;
  deskripsi: string;
  icon: PotensiIcon;
  urutan: number;
};

// Data awal Desa Sita — fallback saat Supabase belum terhubung, basis seed.sql.
export const potensiMock: Potensi[] = [
  {
    id: "pot-1",
    judul: "Pertanian",
    deskripsi: "Lahan pertanian warga menghasilkan berbagai komoditas pangan unggulan desa.",
    icon: "Sprout",
    urutan: 1,
  },
  {
    id: "pot-2",
    judul: "Perkebunan",
    deskripsi: "Komoditas perkebunan menjadi salah satu sumber penghidupan utama masyarakat.",
    icon: "Trees",
    urutan: 2,
  },
  {
    id: "pot-3",
    judul: "Peternakan",
    deskripsi: "Peternakan warga turut menopang ekonomi rumah tangga di desa.",
    icon: "Beef",
    urutan: 3,
  },
];
