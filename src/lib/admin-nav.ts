import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  IdCard,
  Image as ImageIcon,
  LandPlot,
  Landmark,
  LayoutDashboard,
  MessageSquareWarning,
  Newspaper,
  ScrollText,
  Sprout,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  /** Fase PRD tempat halaman ini dibangun — dipakai untuk menandai "Segera". */
  active: boolean;
  minRole?: "admin";
  /** Kosong untuk item submenu — submenu sengaja tanpa ikon, cukup indentasi. */
  icon?: LucideIcon;
  children?: AdminNavItem[];
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Ringkasan", href: "/admin", active: true, icon: LayoutDashboard },
  {
    label: "Identitas Desa",
    href: "/admin/profil-desa",
    active: true,
    minRole: "admin",
    icon: IdCard,
  },
  {
    label: "Statistik",
    href: "/admin/statistik",
    active: true,
    icon: BarChart3,
    children: [
      { label: "Per-RT", href: "/admin/statistik/per-rt", active: true },
      { label: "Sektor Usaha", href: "/admin/statistik/sektor-usaha", active: true },
    ],
  },
  { label: "Berita", href: "/admin/berita", active: false, icon: Newspaper },
  { label: "Galeri", href: "/admin/galeri", active: false, icon: ImageIcon },
  {
    label: "Profil Desa & Wilayah",
    href: "/admin/wilayah",
    active: true,
    icon: LandPlot,
  },
  { label: "Potensi Desa", href: "/admin/potensi", active: true, icon: Sprout },
  { label: "Lembaga Desa", href: "/admin/lembaga", active: true, icon: Building2 },
  {
    label: "Pemerintahan",
    href: "/admin/pemerintahan",
    active: true,
    minRole: "admin",
    icon: Landmark,
  },
  {
    label: "Pengaduan",
    href: "/admin/layanan/pengaduan",
    active: false,
    icon: MessageSquareWarning,
  },
  { label: "Pengguna", href: "/admin/pengguna", active: false, minRole: "admin", icon: Users },
  { label: "Log Audit", href: "/admin/log", active: false, minRole: "admin", icon: ScrollText },
];
