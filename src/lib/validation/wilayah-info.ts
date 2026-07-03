import { z } from "zod";

export const wilayahInfoFormSchema = z.object({
  section: z
    .string()
    .trim()
    .min(1, "Section wajib diisi.")
    .max(64, "Section maksimal 64 karakter.")
    .regex(/^[a-z0-9_]+$/, "Section hanya huruf kecil, angka, underscore."),
  konten: z.string().trim().min(1, "Konten wajib diisi.").max(4000, "Konten maksimal 4000 karakter."),
});

export type WilayahInfoFormValues = z.infer<typeof wilayahInfoFormSchema>;
