import { z } from "zod";

export const kepalaDesaRiwayatFormSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi.").max(120, "Nama maksimal 120 karakter."),
  periode_mulai: z.coerce.number().int().min(1800, "Tahun tidak valid.").max(2200, "Tahun tidak valid."),
  periode_selesai: z
    .string()
    .trim()
    .refine((val) => val === "" || /^\d{4}$/.test(val), "Tahun harus 4 digit angka, atau kosongkan jika masih menjabat."),
  keterangan: z.string().trim().max(500).optional().or(z.literal("")),
  urutan: z.coerce.number().int().min(1, "Urutan minimal 1."),
});

export type KepalaDesaRiwayatFormValues = z.infer<typeof kepalaDesaRiwayatFormSchema>;
