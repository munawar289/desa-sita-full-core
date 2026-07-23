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
        // Hover menaikkan ke elevasi 1 dan menggelapkan border ke border-strong
        // (DESIGN.md §6.2); bayangan selalu diturunkan dari neutral-900 supaya
        // ikut ber-tint hue desa, bukan abu-abu asing di atas permukaan hangat.
        "group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-lg hover:shadow-neutral-900/10",
        className,
      )}
    >
      {/* Glow dekoratif di sudut */}
      <div className="absolute -right-8 -top-8 size-20 rounded-full bg-primary-soft opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      {Icon && (
        <div className="relative mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-primary-soft text-on-primary-soft transition-transform duration-300 group-hover:scale-110">
          <Icon className="size-5" aria-hidden />
        </div>
      )}
      <p className="relative font-mono text-3xl font-semibold tracking-tight text-text">
        {value}
      </p>
      <p className="relative mt-1 text-sm text-text-muted">{label}</p>
    </div>
  );
}
