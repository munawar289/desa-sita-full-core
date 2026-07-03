import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Statistik Lanjutan (Kelompok 1): jenis-kelamin + kelompok-umur
      // digabung jadi satu halaman "Penduduk" (+ breakdown per-RT).
      {
        source: "/data-desa/jenis-kelamin",
        destination: "/data-desa/kependudukan/penduduk",
        permanent: true,
      },
      {
        source: "/data-desa/kelompok-umur",
        destination: "/data-desa/kependudukan/penduduk",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
