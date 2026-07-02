import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export type BreadcrumbNavItem = {
  label: string;
  href?: string;
};

export function BreadcrumbNav({
  items,
  variant = "onDark",
}: {
  items: BreadcrumbNavItem[];
  variant?: "onDark" | "onLight";
}) {
  const onDark = variant === "onDark";

  return (
    <Breadcrumb>
      <BreadcrumbList
        className={cn("text-sm", onDark ? "text-white/70" : "text-espresso-800/60")}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={item.label} className="flex items-center gap-1.5">
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage
                    className={onDark ? "text-white" : "text-espresso-800"}
                  >
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "transition-all duration-200",
                        onDark
                          ? "hover:text-white"
                          : "hover:text-kopi-600",
                      )}
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className={onDark ? "text-white/50" : undefined} />
              )}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
