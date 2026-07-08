import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InviteAdminForm } from "@/components/platform/InviteAdminForm";
import { updateTenantStatusAction } from "@/lib/actions/platform-tenants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Detail Tenant — Panel Platform",
  robots: { index: false, follow: false },
};

export default async function PlatformTenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: tenant } = await supabase
    .from("tenants")
    .select("id, slug, nama, status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!tenant) notFound();

  const nextStatus = tenant.status === "active" ? "suspended" : "active";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-espresso-950">
            {tenant.nama}
          </h1>
          <p className="mt-1 text-sm text-espresso-800/60">Slug: {tenant.slug}</p>
        </div>
        <Badge variant={tenant.status === "active" ? "secondary" : "destructive"}>
          {tenant.status === "active" ? "Aktif" : "Suspended"}
        </Badge>
      </div>

      <section className="rounded-xl border border-kakao-200 bg-white p-4">
        <h2 className="mb-1 font-heading text-sm font-semibold text-espresso-950">
          Status Tenant
        </h2>
        <p className="mb-3 text-sm text-espresso-800/60">
          Suspend memblokir akses dashboard admin tenant ini; situs publiknya tetap tampil
          normal.
        </p>
        <form action={updateTenantStatusAction.bind(null, tenant.id, nextStatus)}>
          <Button
            type="submit"
            variant={nextStatus === "suspended" ? "destructive" : "default"}
            className="rounded-full"
          >
            {nextStatus === "suspended" ? "Suspend Tenant" : "Aktifkan Kembali"}
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-kakao-200 bg-white p-4">
        <h2 className="mb-1 font-heading text-sm font-semibold text-espresso-950">
          Undang Admin Pertama
        </h2>
        <p className="mb-3 text-sm text-espresso-800/60">
          Email yang belum terdaftar akan menerima undangan set kata sandi; email yang sudah
          terdaftar langsung ditambahkan sebagai admin tenant ini.
        </p>
        <InviteAdminForm tenantId={tenant.id} />
      </section>
    </div>
  );
}
