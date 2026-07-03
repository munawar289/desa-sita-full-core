import { z } from "zod";

export const bpdFormSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi.").max(120, "Nama maksimal 120 karakter."),
  jabatan: z.string().trim().min(1, "Jabatan wajib diisi.").max(120, "Jabatan maksimal 120 karakter."),
  pendidikan: z.string().trim().max(120).optional().or(z.literal("")),
  urutan: z.coerce.number().int().min(1, "Urutan minimal 1."),
});

export type BpdFormValues = z.infer<typeof bpdFormSchema>;
