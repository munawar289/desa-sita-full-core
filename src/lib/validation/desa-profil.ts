import { z } from "zod";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

// Validasi warna kini HANYA memeriksa format hex. Guard luminance lama
// (LUMINANCE_MAX = 0.75) yang MENOLAK warna terlalu terang sudah dibuang: color
// derivation engine (src/lib/theme) kini memperbaiki input alih-alih menolaknya
// — kalau admin memilih kuning `#ffd400`, `--color-primary` otomatis turun ke
// shade lebih gelap (`#796300`) dan `--color-on-primary` dipilih lewat kontras
// WCAG, jadi tombol tetap lolos AA tanpa admin perlu tahu soal luminance.
function warnaField(label: string) {
  return z
    .string()
    .trim()
    .regex(HEX_RE, `${label} harus berupa hex 6-digit, mis. #c1602a.`);
}

const currentYear = new Date().getFullYear();

// Batas unggah foto hero — dicek juga di server action saat proses upload,
// dan dipakai untuk `accept` di input file (DESIGN.md §5.2: mobile-first,
// koneksi lambat, jadi limit sengaja kecil).
export const HERO_GAMBAR_MAX_BYTES = 5 * 1024 * 1024;
export const HERO_GAMBAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

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
  hero_gambar_alt: z
    .string()
    .trim()
    .max(180, "Alt teks foto hero maksimal 180 karakter.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null)),
  hero_gambar_hapus: z
    .string()
    .optional()
    .transform((value) => value === "1"),
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
  jumlah_rt: z.coerce
    .number({ message: "Jumlah RT harus berupa angka." })
    .int("Jumlah RT harus bilangan bulat.")
    .min(1, "Jumlah RT minimal 1."),
});

export type DesaProfilFormValues = z.infer<typeof desaProfilFormSchema>;
