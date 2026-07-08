import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

/**
 * Root layout TERPISAH dari src/app/(site)/layout.tsx — /platform (landlord)
 * TIDAK boleh memanggil getDesaProfil()/getCurrentTenant() sama sekali, jadi
 * tidak ada Navbar/Footer/tema warna tenant di sini. Warna kopi-600/gold-500/
 * dst otomatis jatuh ke default :root di globals.css (bukan warna tenant).
 */

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

export default function PlatformRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-background text-espresso-800">
        {children}
      </body>
    </html>
  );
}
