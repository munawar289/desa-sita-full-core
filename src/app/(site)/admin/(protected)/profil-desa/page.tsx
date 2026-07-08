import type { Metadata } from "next";
import { DesaProfilForm } from "@/components/admin/DesaProfilForm";
import { getDesaProfil } from "@/lib/queries/desa-profil";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Identitas Desa",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

export default async function AdminProfilDesaPage() {
  const profil = await getDesaProfil();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-espresso-950">Identitas Desa</h1>
        <p className="mt-1 text-sm text-espresso-800/60">
          Satu sumber kebenaran untuk nama desa, lokasi, kontak, dan tema warna — dipakai di seluruh
          situs publik.
        </p>
      </div>
      <DesaProfilForm profil={profil} />
    </div>
  );
}
