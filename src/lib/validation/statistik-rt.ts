import { z } from "zod";

const numericString = z
  .string()
  .trim()
  .refine((val) => val === "" || /^-?\d+(\.\d+)?$/.test(val), "Nilai harus berupa angka.");

export const statistikRtSingleValueSchema = z.object({
  id: z.string().uuid(),
  value: numericString,
});

/** Kategori multi-metrik (PRD statistik-lanjutan §3.2): detail disimpan sebagai jsonb. */
export const DETAIL_FIELDS: Record<string, { key: string; label: string }[]> = {
  air_bersih: [
    { key: "pdam", label: "PDAM" },
    { key: "ledeng", label: "Air Ledeng" },
  ],
  aset_tanaman: [
    { key: "kopi", label: "Kopi" },
    { key: "cengkeh", label: "Cengkeh" },
    { key: "kakao", label: "Kakao" },
    { key: "kemiri", label: "Kemiri" },
  ],
};

export function isMultiMetricCategory(category: string): boolean {
  return category in DETAIL_FIELDS;
}

export const statistikRtDetailSchema = z.object({
  id: z.string().uuid(),
  detail: z.record(z.string(), numericString),
});
