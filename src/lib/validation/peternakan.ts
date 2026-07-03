import { z } from "zod";

const numericString = z
  .string()
  .trim()
  .refine((val) => val === "" || /^\d+$/.test(val), "Harus berupa angka.");

export const peternakanFormSchema = z.object({
  jenis_ternak: z
    .string()
    .trim()
    .min(1, "Jenis ternak wajib diisi.")
    .max(120, "Jenis ternak maksimal 120 karakter."),
  populasi: numericString,
  jumlah_pemilik: numericString,
  urutan: z.coerce.number().int().min(1, "Urutan minimal 1."),
});

export type PeternakanFormValues = z.infer<typeof peternakanFormSchema>;
