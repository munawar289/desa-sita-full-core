import { z } from "zod";

// Regex identik constraint DB `tenants_slug_format` (0009_tenants_foundation.sql).
export const platformTenantFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi.")
    .max(63, "Slug maksimal 63 karakter.")
    .regex(
      /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/,
      "Slug harus huruf kecil/angka/tanda hubung, tidak boleh diawali atau diakhiri tanda hubung.",
    ),
  nama: z.string().trim().min(1, "Nama wajib diisi.").max(120, "Nama maksimal 120 karakter."),
});

export type PlatformTenantFormValues = z.infer<typeof platformTenantFormSchema>;

export const platformInviteAdminFormSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  tenant_id: z.string().uuid("Tenant tidak valid."),
});

export type PlatformInviteAdminFormValues = z.infer<typeof platformInviteAdminFormSchema>;
