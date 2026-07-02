"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Berita } from "@/lib/data/berita";
import { BeritaGrid } from "./BeritaGrid";

const filters: { value: "semua" | "Berita" | "Pengumuman"; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "Berita", label: "Berita" },
  { value: "Pengumuman", label: "Pengumuman" },
];

export function BeritaExplorer({ data }: { data: Berita[] }) {
  const [active, setActive] = useState<"semua" | "Berita" | "Pengumuman">("semua");

  const published = data
    .filter((item) => item.status === "published")
    .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));

  const filtered =
    active === "semua" ? published : published.filter((item) => item.kategori === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActive(filter.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
              active === filter.value
                ? "border-kopi-600 bg-kopi-600 text-white"
                : "border-kakao-200 bg-white text-espresso-800 hover:border-kopi-400 hover:text-kopi-600",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <BeritaGrid items={filtered} />
      </div>
    </div>
  );
}
