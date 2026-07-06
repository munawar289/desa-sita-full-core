import { BreadcrumbNav, type BreadcrumbNavItem } from "@/components/shared/BreadcrumbNav";

export function PageHeader({
  title,
  breadcrumbItems,
}: {
  title: string;
  breadcrumbItems: BreadcrumbNavItem[];
}) {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-kopi-600 to-panel-800 px-4 py-12 sm:px-6">
      {/* Glow + pola titik dekoratif */}
      <div className="absolute -right-16 -top-20 size-72 rounded-full bg-kopi-400/25 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 size-64 rounded-full bg-panel-950/40 blur-3xl" />
      <div className="bg-dot-grid absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-6xl">
        <BreadcrumbNav items={breadcrumbItems} variant="onDark" />
        <h1 className="mt-3 font-heading text-3xl font-semibold text-white drop-shadow-sm sm:text-4xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
