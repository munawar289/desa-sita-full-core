import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Berita } from "@/lib/data/berita";
import { BeritaCard } from "./BeritaCard";

export function BeritaGrid({ items }: { items: Berita[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<FileQuestion />}
        message="Belum ada berita tersedia"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {items.map((berita) => (
        <BeritaCard key={berita.id} berita={berita} />
      ))}
    </div>
  );
}
