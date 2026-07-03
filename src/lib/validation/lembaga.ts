import { z } from "zod";

export const lembagaFormSchema = z.object({
  kategori: z.enum(["kemasyarakatan", "ekonomi", "pendidikan", "keamanan"], {
    message: "Kategori tidak valid.",
  }),
  nama: z.string().trim().min(1, "Nama wajib diisi.").max(120, "Nama maksimal 120 karakter."),
  dasar_hukum: z.string().trim().max(120).optional().or(z.literal("")),
  jumlah_pengurus: z
    .string()
    .trim()
    .refine((val) => val === "" || /^\d+$/.test(val), "Jumlah pengurus harus berupa angka."),
  keterangan: z.string().trim().max(500).optional().or(z.literal("")),
  urutan: z.coerce.number().int().min(1, "Urutan minimal 1."),
});

export type LembagaFormValues = z.infer<typeof lembagaFormSchema>;
