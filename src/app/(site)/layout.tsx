import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDesaProfil } from "@/lib/queries/desa-profil";
import { buildMetadata } from "@/lib/metadata";
import { buildThemeCssVariables } from "@/lib/theme";
import "../globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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

  // Inline style di elemen ini punya spesifisitas lebih tinggi dari :root, jadi
  // override tema warna per tenant berlaku tanpa menyentuh token struktural
  // (--radius, dst). Nilainya seluruhnya token semantik hasil color derivation
  // engine (src/lib/theme) dari 3 slot warna profil — lihat DESIGN.md.
  const temaWarna = buildThemeCssVariables(profil) as React.CSSProperties;

  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${poppins.variable} ${plexMono.variable} h-full antialiased`}
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
