import { z } from "zod";

export const wilayahInfoFormSchema = z.object({
  section: z
    .string()
    .trim()
    .min(1, "Section wajib diisi.")
    .max(64, "Section maksimal 64 karakter.")
    .regex(/^[a-z0-9_]+$/, "Section hanya huruf kecil, angka, underscore."),
  konten: z.string().trim().min(1, "Konten wajib diisi.").max(4000, "Konten maksimal 4000 karakter."),
  page: z.enum(["wilayah", "sejarah"], { message: "Halaman tidak valid." }),
  judul: z.string().trim().min(1, "Judul wajib diisi.").max(80, "Judul maksimal 80 karakter."),
  eyebrow: z.string().trim().min(1, "Label wajib diisi.").max(40, "Label maksimal 40 karakter."),
  urutan: z.coerce.number().int().min(0, "Urutan minimal 0."),
});

export type WilayahInfoFormValues = z.infer<typeof wilayahInfoFormSchema>;
