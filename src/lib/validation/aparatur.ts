import { z } from "zod";

export const aparaturFormSchema = z.object({
  nama: z.string().trim().max(120).optional().or(z.literal("")),
  jabatan: z.string().trim().min(1, "Jabatan wajib diisi.").max(120, "Jabatan maksimal 120 karakter."),
  pendidikan: z.string().trim().max(120).optional().or(z.literal("")),
  urutan: z.coerce.number().int().min(1, "Urutan minimal 1."),
});

export type AparaturFormValues = z.infer<typeof aparaturFormSchema>;
