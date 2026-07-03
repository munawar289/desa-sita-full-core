export type NavLink = {
  label: string;
  href: string;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Profil Desa",
    href: "/profil-desa",
    children: [
      { label: "Hub Profil Desa", href: "/profil-desa" },
      { label: "Sejarah", href: "/profil-desa/sejarah" },
      { label: "Wilayah", href: "/profil-desa/wilayah" },
    ],
  },
  {
    label: "Data Desa",
    href: "/data-desa",
    children: [
      { label: "Hub Statistik", href: "/data-desa" },
      { label: "Wilayah Administratif", href: "/data-desa/wilayah-administratif" },
      { label: "Penduduk", href: "/data-desa/kependudukan/penduduk" },
      { label: "Keluarga", href: "/data-desa/kependudukan/keluarga" },
      { label: "Pengangguran", href: "/data-desa/kependudukan/pengangguran" },
      { label: "Kesejahteraan Keluarga", href: "/data-desa/ekonomi/kesejahteraan-keluarga" },
      { label: "Struktur Mata Pencaharian", href: "/data-desa/ekonomi/mata-pencaharian" },
      { label: "Produk Domestik Bruto", href: "/data-desa/ekonomi/pdb" },
      { label: "Pendapatan Riil Keluarga", href: "/data-desa/ekonomi/pendapatan-riil" },
      { label: "Aset Ekonomi", href: "/data-desa/ekonomi/aset-ekonomi" },
      { label: "Pendidikan", href: "/data-desa/pendidikan" },
      { label: "Kesehatan", href: "/data-desa/kesehatan" },
      { label: "Keamanan & Kelembagaan", href: "/data-desa/keamanan-kelembagaan" },
      { label: "Sarana & Prasarana", href: "/data-desa/sarana-prasarana" },
    ],
  },
  { label: "Pemerintahan", href: "/pemerintahan" },
  { label: "Lembaga Desa", href: "/lembaga-desa" },
  { label: "Berita", href: "/berita" },
  { label: "Layanan", href: "/layanan" },
];

export const footerNavItems: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Profil Desa", href: "/profil-desa" },
  { label: "Data Desa", href: "/data-desa" },
  { label: "Pemerintahan", href: "/pemerintahan" },
  { label: "Lembaga Desa", href: "/lembaga-desa" },
  { label: "Berita", href: "/berita" },
  { label: "Layanan", href: "/layanan" },
  { label: "Rencana Pengembangan", href: "/rencana-pengembangan" },
];
