import { z } from "zod";

export const statistikFormSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, "Kategori wajib diisi.")
    .max(64, "Kategori maksimal 64 karakter.")
    .regex(/^[a-z0-9_]+$/, "Kategori hanya huruf kecil, angka, underscore."),
  key: z
    .string()
    .trim()
    .min(1, "Key wajib diisi.")
    .max(64, "Key maksimal 64 karakter.")
    .regex(/^[a-z0-9_]+$/, "Key hanya huruf kecil, angka, underscore."),
  label: z.string().trim().min(1, "Label wajib diisi.").max(120, "Label maksimal 120 karakter."),
  value: z.string().trim().min(1, "Nilai wajib diisi.").max(120, "Nilai maksimal 120 karakter."),
});

export type StatistikFormValues = z.infer<typeof statistikFormSchema>;
