import { z } from "zod";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

// Relative luminance (WCAG) — dipakai sebagai guard kontras karena warna
// primer/sekunder/aksen selalu dipasangkan dengan teks putih/krem
// (--primary-foreground, tombol CTA, badge). Ambang 0.75 usulan PRD §3.3/§8:
// warna di atasnya dianggap terlalu terang untuk teks putih tetap terbaca.
const LUMINANCE_MAX = 0.75;

function relativeLuminance(hex: string): number {
  const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((part) => {
    const channel = parseInt(part, 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function warnaField(label: string) {
  return z
    .string()
    .trim()
    .regex(HEX_RE, `${label} harus berupa hex 6-digit, mis. #c1602a.`)
    .refine((hex) => relativeLuminance(hex) <= LUMINANCE_MAX, {
      message: `${label} terlalu terang, teks putih di atasnya sulit dibaca.`,
    });
}

const currentYear = new Date().getFullYear();

export const desaProfilFormSchema = z.object({
  nama_desa: z.string().trim().min(1, "Nama desa wajib diisi.").max(80, "Nama desa maksimal 80 karakter."),
  kecamatan: z.string().trim().min(1, "Kecamatan wajib diisi.").max(80, "Kecamatan maksimal 80 karakter."),
  kabupaten: z.string().trim().min(1, "Kabupaten wajib diisi.").max(80, "Kabupaten maksimal 80 karakter."),
  provinsi: z.string().trim().min(1, "Provinsi wajib diisi.").max(80, "Provinsi maksimal 80 karakter."),
  hero_deskripsi: z
    .string()
    .trim()
    .min(1, "Deskripsi hero wajib diisi.")
    .max(300, "Deskripsi hero maksimal 300 karakter."),
  email: z
    .string()
    .trim()
    .max(120, "Email maksimal 120 karakter.")
    .email("Format email tidak valid.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  jam_layanan: z
    .string()
    .trim()
    .max(80, "Jam layanan maksimal 80 karakter.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  zona_waktu: z
    .string()
    .trim()
    .max(16, "Zona waktu maksimal 16 karakter.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  tahun_berdiri: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? Number(value) : null))
    .refine(
      (value) => value === null || (Number.isInteger(value) && value >= 1800 && value <= currentYear),
      { message: `Tahun berdiri harus di antara 1800–${currentYear}.` },
    ),
  warna_primer: warnaField("Warna utama"),
  warna_sekunder: warnaField("Warna sekunder"),
  warna_aksen: warnaField("Warna aksen"),
});

export type DesaProfilFormValues = z.infer<typeof desaProfilFormSchema>;
