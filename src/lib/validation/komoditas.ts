import { z } from "zod";

export const komoditasFormSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi.").max(120, "Nama maksimal 120 karakter."),
  luas_ha: z
    .string()
    .trim()
    .refine((val) => val === "" || /^\d+(\.\d+)?$/.test(val), "Luas harus berupa angka."),
  hasil_panen: z.string().trim().max(120).optional().or(z.literal("")),
  urutan: z.coerce.number().int().min(1, "Urutan minimal 1."),
});

export type KomoditasFormValues = z.infer<typeof komoditasFormSchema>;
