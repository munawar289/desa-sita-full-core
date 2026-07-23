import "../globals.css";

/**
 * Root layout TERPISAH untuk halaman perkakas internal (/dev/*).
 *
 * Sengaja tidak memanggil getDesaProfil()/getCurrentTenant(): halaman preview
 * tema harus bisa dirender dengan warna sembarang dari query string, bukan
 * warna tenant yang sedang diakses. Tidak ada Navbar/Footer supaya yang
 * terlihat murni token-nya saja.
 */

export const metadata = {
  title: "Perkakas Internal",
  robots: { index: false, follow: false },
};

export default function DevRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
