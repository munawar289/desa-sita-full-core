export type AdminNavItem = {
  label: string;
  href: string;
  /** Fase PRD tempat halaman ini dibangun — dipakai untuk menandai "Segera". */
  active: boolean;
  minRole?: "admin";
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Ringkasan", href: "/admin", active: true },
  { label: "Statistik", href: "/admin/statistik", active: true },
  { label: "Berita", href: "/admin/berita", active: false },
  { label: "Galeri", href: "/admin/galeri", active: false },
  { label: "Lembaga Desa", href: "/admin/lembaga", active: false },
  { label: "Pemerintahan", href: "/admin/pemerintahan", active: false, minRole: "admin" },
  { label: "Pengaduan", href: "/admin/layanan/pengaduan", active: false },
  { label: "Pengguna", href: "/admin/pengguna", active: false, minRole: "admin" },
  { label: "Log Audit", href: "/admin/log", active: false, minRole: "admin" },
];
