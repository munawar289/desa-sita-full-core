import type { LucideIcon } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";

export type StatCardGridItem = {
  label: string;
  value: string;
  icon?: LucideIcon;
};

export function StatCardGrid({ items }: { items: StatCardGridItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} />
      ))}
    </div>
  );
}
