import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDesaProfil } from "@/lib/queries/desa-profil";
import { buildMetadata } from "@/lib/metadata";
import { buildThemeCssVariables } from "@/lib/theme";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profil = await getDesaProfil();

  // Inline style di elemen ini punya spesifisitas lebih tinggi dari :root/.dark
  // untuk elemen yang sama, jadi override tema warna berlaku di light & dark
  // mode tanpa menyentuh token struktural (--background, --foreground, dst).
  //
  // Dua lapis, sementara:
  //   1. Lima var --warna-* mentah — dikonsumsi sisa palet lama (kopi/sawah/
  //      gold/panel) di globals.css, yang masih dipakai halaman yang belum
  //      dimigrasi. Hilang bersama palet lama di Fase 7.
  //   2. Token semantik hasil color derivation engine (src/lib/theme) — inilah
  //      yang dikonsumsi komponen yang sudah dimigrasi. Lihat DESIGN.md.
  const temaWarna = {
    "--warna-primer": profil.warna_primer,
    "--warna-sekunder": profil.warna_sekunder,
    "--warna-aksen": profil.warna_aksen,
    "--warna-latar-gelap": profil.warna_latar_gelap,
    "--warna-latar": profil.warna_latar,
    ...buildThemeCssVariables(profil),
  } as React.CSSProperties;

  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
      style={temaWarna}
    >
      <body className="min-h-full flex flex-col font-body bg-surface-alt text-text">
        <Navbar profil={profil} />
        <main className="flex-1">{children}</main>
        <Footer profil={profil} />
      </body>
    </html>
  );
}
