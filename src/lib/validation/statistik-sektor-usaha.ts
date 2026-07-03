import { z } from "zod";

const numericString = z
  .string()
  .trim()
  .refine((val) => val === "" || /^-?\d+(\.\d+)?$/.test(val), "Nilai harus berupa angka.");

export const statistikSektorUsahaFormSchema = z.object({
  id: z.string().uuid(),
  nilai_ribu_rupiah: numericString,
});
