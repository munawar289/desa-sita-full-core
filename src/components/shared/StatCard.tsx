import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-kakao-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md",
        className,
      )}
    >
      {Icon && <Icon className="mb-2 size-6 text-kopi-600" />}
      <p className="font-heading text-3xl font-bold text-espresso-950">{value}</p>
      <p className="mt-1 text-sm text-espresso-800/70">{label}</p>
    </div>
  );
}
