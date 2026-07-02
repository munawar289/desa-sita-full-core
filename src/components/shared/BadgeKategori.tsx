import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type BadgeKategoriTone = "kopi" | "sawah" | "tanah" | "netral";

const toneClasses: Record<BadgeKategoriTone, string> = {
  kopi: "bg-kopi-100 text-kopi-600",
  sawah: "bg-sawah-100 text-sawah-700",
  tanah: "bg-tanah-100 text-tanah-500",
  netral: "bg-kakao-100 text-espresso-800",
};

export function BadgeKategori({
  label,
  tone = "kopi",
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
