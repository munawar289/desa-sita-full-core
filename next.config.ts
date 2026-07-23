import type { NextConfig } from "next";

// Host Supabase Storage untuk foto hero desa_profil (BACKEND_TODO.md #1) —
// diturunkan dari env, bukan hardcode, karena tiap environment (dev/staging/
// prod) punya project Supabase sendiri.
const supabaseHostname = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/desa-hero/**",
          },
        ]
      : [],
  },
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
