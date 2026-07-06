// Struktur identik tabel `desa_profil` — PRD profil-desa §3.2
// Profil singleton: satu baris identitas desa + tema warna, bukan daftar.
export type DesaProfil = {
  id: string;
  nama_desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  hero_deskripsi: string;
  email: string | null;
  jam_layanan: string | null;
  zona_waktu: string | null;
  tahun_berdiri: number | null;
  warna_primer: string;
  warna_sekunder: string;
  warna_aksen: string;
  warna_latar_gelap: string;
  warna_latar: string;
  updated_at: string;
};

// Nilai identik dengan yang tampil hari ini (hardcode lama) — fallback saat
// Supabase belum terhubung, basis baris seed di migrations/0005_desa_profil.sql
// (+ 0006_desa_profil_latar.sql untuk 2 kolom warna latar).
export const desaProfilMock: DesaProfil = {
  id: "desa-profil-sita",
  nama_desa: "Sita",
  kecamatan: "Rana Mese",
  kabupaten: "Manggarai Timur",
  provinsi: "Nusa Tenggara Timur",
  hero_deskripsi:
    "Desa agraris di kaki pegunungan Rana Mese — hidup dari hasil kebun dan sawah sejak tahun 1966.",
  email: "desasita@ranames.manggaraitimurkab.go.id",
  jam_layanan: "Senin–Jumat, 08.00–16.00",
  zona_waktu: "WITA",
  tahun_berdiri: 1966,
  warna_primer: "#c1602a",
  warna_sekunder: "#5b7a41",
  warna_aksen: "#d9a441",
  warna_latar_gelap: "#3d2a1d",
  warna_latar: "#f5efe2",
  updated_at: "2026-06-01",
};
