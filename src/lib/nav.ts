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
      { label: "Jenis Kelamin", href: "/data-desa/jenis-kelamin" },
      { label: "Kelompok Umur", href: "/data-desa/kelompok-umur" },
      { label: "Pendidikan", href: "/data-desa/pendidikan" },
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
