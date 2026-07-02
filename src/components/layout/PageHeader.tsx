import { BreadcrumbNav, type BreadcrumbNavItem } from "@/components/shared/BreadcrumbNav";

export function PageHeader({
  title,
  breadcrumbItems,
}: {
  title: string;
  breadcrumbItems: BreadcrumbNavItem[];
}) {
  return (
    <div className="bg-gradient-to-br from-kopi-600 to-espresso-800 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <BreadcrumbNav items={breadcrumbItems} variant="onDark" />
        <h1 className="mt-2 font-heading text-3xl font-semibold text-white">
          {title}
        </h1>
      </div>
    </div>
  );
}
