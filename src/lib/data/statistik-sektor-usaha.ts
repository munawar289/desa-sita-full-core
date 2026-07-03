// Struktur identik tabel `statistik_sektor_usaha` — PRD statistik-lanjutan §3.2
export type StatistikSektorUsaha = {
  id: string;
  jenis: "pdb" | "pendapatan_riil";
  kode: string;
  nama: string;
  nilai_ribu_rupiah: number | null;
  updated_at: string;
  urutan: number;
};

const SEKTOR: [string, string][] = [
  ["A", "Pertanian, Kehutanan, dan Perikanan"],
  ["B", "Pertambangan dan Penggalian"],
  ["C", "Industri Pengolahan"],
  ["D", "Pengadaan Listrik dan Gas"],
  ["E", "Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang"],
  ["F", "Konstruksi"],
  ["G", "Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor"],
  ["H", "Transportasi dan Pergudangan"],
  ["I", "Penyediaan Akomodasi dan Makan Minum"],
  ["J", "Informasi dan Komunikasi"],
  ["K", "Jasa Keuangan dan Asuransi"],
  ["L", "Real Estate"],
  ["M,N", "Jasa Perusahaan"],
  ["O", "Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib"],
  ["P", "Jasa Pendidikan"],
  ["Q", "Jasa Kesehatan dan Kegiatan Sosial"],
  ["R,S,T,U", "Jasa lainnya"],
];

function buildRows(jenis: "pdb" | "pendapatan_riil"): StatistikSektorUsaha[] {
  return SEKTOR.map(([kode, nama], index) => ({
    id: `sektor-${jenis}-${index + 1}`,
    jenis,
    kode,
    nama,
    nilai_ribu_rupiah: null,
    updated_at: "2026-06-01",
    urutan: index + 1,
  }));
}

export const statistikSektorUsahaMock: StatistikSektorUsaha[] = [
  ...buildRows("pdb"),
  ...buildRows("pendapatan_riil"),
];
