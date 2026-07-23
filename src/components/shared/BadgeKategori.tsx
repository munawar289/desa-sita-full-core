import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Varian badge DESIGN.md §6.3. Tiap varian memasangkan latar `-soft` dengan
 * teks `on-*-soft` pasangannya, jadi tidak ada kombinasi yang bisa gagal AA
 * untuk warna desa apa pun.
 */
export type BadgeKategoriTone = "primer" | "sekunder" | "aksen" | "netral" | "solid";

const toneClasses: Record<BadgeKategoriTone, string> = {
  primer: "bg-primary-soft text-on-primary-soft",
  sekunder: "bg-secondary-soft text-on-secondary-soft",
  aksen: "bg-accent-soft text-on-accent-soft",
  netral: "bg-surface-alt text-text-muted",
  solid: "bg-primary text-on-primary",
};

export function BadgeKategori({
  label,
  tone = "primer",
  className,
}: {
  label: string;
  tone?: BadgeKategoriTone;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "h-auto rounded-full border-0 px-3 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </Badge>
  );
}
