import { BreadcrumbNav, type BreadcrumbNavItem } from "@/components/shared/BreadcrumbNav";

export function PageHeader({
  title,
  breadcrumbItems,
}: {
  title: string;
  breadcrumbItems: BreadcrumbNavItem[];
}) {
  return (
    // Latar rata `--color-panel`, bukan gradient antar dua warna: on-panel
    // dipilih engine berdasarkan kontras terhadap panel, jadi begitu latarnya
    // menyapu ke shade lain kontras teksnya tidak lagi dijamin.
    <div className="relative overflow-hidden bg-panel px-4 py-12 sm:px-6">
      {/* Glow + pola titik dekoratif */}
      <div className="absolute -right-16 -top-20 size-72 rounded-full bg-primary-400/25 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 size-64 rounded-full bg-panel-strong/50 blur-3xl" />
      <div className="bg-dot-grid absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-6xl">
        <BreadcrumbNav items={breadcrumbItems} variant="onDark" />
        <h1 className="mt-3 font-heading text-3xl font-semibold text-on-panel drop-shadow-sm sm:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
