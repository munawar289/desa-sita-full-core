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
        "group relative overflow-hidden rounded-2xl border border-kakao-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-kopi-400/60 hover:shadow-lg hover:shadow-kopi-600/10",
        className,
      )}
    >
      {/* Accent glow di sudut */}
      <div className="absolute -right-8 -top-8 size-20 rounded-full bg-kopi-100 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      {Icon && (
        <div className="relative mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-kopi-100 text-sawah-700 transition-transform duration-300 group-hover:scale-110">
          <Icon className="size-5" />
        </div>
      )}
      <p className="relative font-mono text-3xl font-semibold tracking-tight text-espresso-950">
        {value}
      </p>
      <p className="relative mt-1 text-sm text-espresso-800/70">{label}</p>
    </div>
  );
}
