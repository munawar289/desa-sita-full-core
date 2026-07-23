import { Plus_Jakarta_Sans, Poppins, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

/**
 * Root layout TERPISAH — halaman set-password bersifat publik/tenant-agnostic
 * (dipakai flow undangan landlord), tidak boleh ikut Navbar/Footer/tema desa.
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

export default function SetPasswordRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${poppins.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-background text-text">
        {children}
      </body>
    </html>
  );
}
