import type { Statistik } from "@/lib/data/statistik";
import type { StatistikRt } from "@/lib/data/statistik-rt";
import type { StatistikSektorUsaha } from "@/lib/data/statistik-sektor-usaha";
import type { StatistikKelompokUmur } from "@/lib/data/statistik-kelompok-umur";
import type { StatistikPendidikan } from "@/lib/data/statistik-pendidikan";

export type ProdeskelContext = {
  statistik: Statistik[];
  statistikRt: StatistikRt[];
  statistikSektorUsaha: StatistikSektorUsaha[];
  statistikKelompokUmur: StatistikKelompokUmur[];
  statistikPendidikan: StatistikPendidikan[];
};

function hasCategory(statistik: Statistik[], category: string): boolean {
  return statistik.some((item) => item.category === category);
}

function hasRtCategory(statistikRt: StatistikRt[], category: string): boolean {
  return statistikRt.some(
    (item) => item.category === category && (item.value !== null || item.detail !== null),
  );
}

function hasSektorUsaha(sektor: StatistikSektorUsaha[], jenis: "pdb" | "pendapatan_riil"): boolean {
  return sektor.some((item) => item.jenis === jenis && item.nilai_ribu_rupiah !== null);
}

/**
 * 37 kategori data Prodeskel (Permendagri 12/2007), sesuai sheet 1
 * "Lampiran Pertanyaan DESA III.1." pada source xlsx. Daftar ini tidak
 * berubah (baku Permendagri) — hanya fungsi `cek` yang otomatis
 * menyesuaikan saat admin mengisi data baru (PRD statistik-lanjutan §4.2).
 */
export const PRODESKEL_CHECKLIST: {
  nomor: number;
  bab: string;
  label: string;
  cek: (ctx: ProdeskelContext) => boolean;
}[] = [
  { nomor: 1, bab: "Perkembangan Penduduk", label: "Jumlah penduduk", cek: (c) => hasCategory(c.statistik, "kependudukan") },
  { nomor: 2, bab: "Perkembangan Penduduk", label: "Jumlah keluarga", cek: (c) => hasCategory(c.statistik, "kependudukan") },

  { nomor: 3, bab: "Ekonomi Masyarakat", label: "Pengangguran", cek: (c) => hasRtCategory(c.statistikRt, "pengangguran") },
  { nomor: 4, bab: "Ekonomi Masyarakat", label: "Kesejahteraan keluarga", cek: (c) => hasCategory(c.statistik, "kesejahteraan_keluarga") },
  { nomor: 5, bab: "Ekonomi Masyarakat", label: "Produk domestik desa/kelurahan bruto", cek: (c) => hasSektorUsaha(c.statistikSektorUsaha, "pdb") },
  { nomor: 6, bab: "Ekonomi Masyarakat", label: "Pendapatan perkapita menurut sektor usaha", cek: () => false },
  { nomor: 7, bab: "Ekonomi Masyarakat", label: "Pendapatan riil keluarga", cek: (c) => hasSektorUsaha(c.statistikSektorUsaha, "pendapatan_riil") },
  { nomor: 8, bab: "Ekonomi Masyarakat", label: "Struktur mata pencaharian menurut sektor", cek: (c) => hasCategory(c.statistik, "mata_pencaharian") },
  { nomor: 9, bab: "Ekonomi Masyarakat", label: "Aset tanah", cek: (c) => hasCategory(c.statistik, "aset_tanah") },
  { nomor: 10, bab: "Ekonomi Masyarakat", label: "Aset sarana transportasi umum", cek: (c) => hasCategory(c.statistik, "aset_transportasi") },
  { nomor: 11, bab: "Ekonomi Masyarakat", label: "Aset sarana produksi", cek: (c) => hasCategory(c.statistik, "aset_sarana_produksi") },
  { nomor: 12, bab: "Ekonomi Masyarakat", label: "Aset perumahan", cek: (c) => hasCategory(c.statistik, "aset_perumahan") },
  { nomor: 13, bab: "Ekonomi Masyarakat", label: "Pemilikan aset ekonomi lainnya", cek: (c) => hasRtCategory(c.statistikRt, "aset_tanaman") },

  { nomor: 14, bab: "Pendidikan Masyarakat", label: "Tingkat pendidikan penduduk", cek: (c) => c.statistikPendidikan.length > 0 },
  { nomor: 15, bab: "Pendidikan Masyarakat", label: "Wajib belajar 9 tahun", cek: () => false },
  { nomor: 16, bab: "Pendidikan Masyarakat", label: "Rasio guru dan murid", cek: (c) => hasCategory(c.statistik, "rasio_guru_murid") },
  { nomor: 17, bab: "Pendidikan Masyarakat", label: "Kelembagaan pendidikan masyarakat", cek: (c) => hasCategory(c.statistik, "lembaga_pendidikan_negeri") || hasCategory(c.statistik, "lembaga_pendidikan_swasta") },

  { nomor: 18, bab: "Kesehatan Masyarakat", label: "Kualitas ibu hamil", cek: (c) => hasCategory(c.statistik, "kualitas_ibu_hamil") },
  { nomor: 19, bab: "Kesehatan Masyarakat", label: "Kualitas bayi", cek: (c) => hasCategory(c.statistik, "kualitas_bayi") },
  { nomor: 20, bab: "Kesehatan Masyarakat", label: "Kualitas persalinan", cek: (c) => hasCategory(c.statistik, "kualitas_persalinan") },
  { nomor: 21, bab: "Kesehatan Masyarakat", label: "Cakupan imunisasi", cek: (c) => hasCategory(c.statistik, "imunisasi") },
  { nomor: 22, bab: "Kesehatan Masyarakat", label: "Perkembangan pasangan usia subur dan KB", cek: (c) => hasCategory(c.statistik, "kb_jangka_panjang") || hasCategory(c.statistik, "kb_non_jangka_panjang") },
  { nomor: 23, bab: "Kesehatan Masyarakat", label: "Wabah penyakit", cek: (c) => hasCategory(c.statistik, "wabah_penyakit") },
  { nomor: 24, bab: "Kesehatan Masyarakat", label: "Angka harapan hidup", cek: () => false },
  { nomor: 25, bab: "Kesehatan Masyarakat", label: "Cakupan pemenuhan kebutuhan air bersih", cek: (c) => hasRtCategory(c.statistikRt, "air_bersih") },
  { nomor: 26, bab: "Kesehatan Masyarakat", label: "Perilaku hidup bersih dan sehat", cek: () => false },
  { nomor: 27, bab: "Kesehatan Masyarakat", label: "Status gizi balita", cek: (c) => hasCategory(c.statistik, "gizi_balita") },
  { nomor: 28, bab: "Kesehatan Masyarakat", label: "Jumlah penderita sakit tahun ini", cek: () => false },
  { nomor: 29, bab: "Kesehatan Masyarakat", label: "Perkembangan sarana dan prasarana kesehatan masyarakat", cek: (c) => hasCategory(c.statistik, "sarana_kesehatan") },

  { nomor: 30, bab: "Keamanan & Politik", label: "Keamanan dan ketertiban", cek: (c) => hasCategory(c.statistik, "keamanan") },
  { nomor: 31, bab: "Keamanan & Politik", label: "Kedaulatan politik masyarakat", cek: () => false },

  { nomor: 32, bab: "Lembaga Kemasyarakatan", label: "Lembaga kemasyarakatan desa/kelurahan", cek: (c) => hasCategory(c.statistik, "lembaga_kemasyarakatan") },
  { nomor: 33, bab: "Lembaga Kemasyarakatan", label: "Organisasi anggota lembaga kemasyarakatan", cek: () => false },

  { nomor: 34, bab: "Pemerintahan Desa", label: "APB-Desa dan anggaran kelurahan", cek: () => false },
  { nomor: 35, bab: "Pemerintahan Desa", label: "Pertanggungjawaban kepala desa/lurah", cek: () => false },
  { nomor: 36, bab: "Pemerintahan Desa", label: "Prasarana dan administrasi pemerintahan desa/kelurahan", cek: () => false },
  { nomor: 37, bab: "Pemerintahan Desa", label: "Pembinaan dan pengawasan", cek: () => false },
];
