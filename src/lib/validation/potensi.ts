import { z } from "zod";
import { POTENSI_ICON_OPTIONS } from "@/lib/data/potensi";

export const potensiFormSchema = z.object({
  judul: z.string().trim().min(1, "Judul wajib diisi.").max(60, "Judul maksimal 60 karakter."),
  deskripsi: z
    .string()
    .trim()
    .min(1, "Deskripsi wajib diisi.")
    .max(300, "Deskripsi maksimal 300 karakter."),
  icon: z.enum(POTENSI_ICON_OPTIONS, { message: "Ikon tidak valid." }),
  urutan: z.coerce.number().int().min(1, "Urutan minimal 1."),
});

export type PotensiFormValues = z.infer<typeof potensiFormSchema>;
