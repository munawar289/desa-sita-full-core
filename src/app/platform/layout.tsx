import { Plus_Jakarta_Sans, Poppins, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

/**
 * Root layout TERPISAH dari src/app/(site)/layout.tsx — /platform (landlord)
 * TIDAK boleh memanggil getDesaProfil()/getCurrentTenant() sama sekali, jadi
 * tidak ada Navbar/Footer/tema warna tenant di sini. Landlord memakai palet
 * `plat-*` (Material 3 biru BPS) yang tetap, bukan token tenant yang berganti
 * per desa — lihat DESIGN.md dan K14.
 */

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

export default function PlatformRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${poppins.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-plat-background text-plat-on-background">
        {children}
      </body>
    </html>
  );
}
