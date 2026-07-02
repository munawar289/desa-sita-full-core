"use client";

import { useState } from "react";
import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import type { Lembaga, LembagaKategori } from "@/lib/data/lembaga";

const filters: { value: LembagaKategori | "semua"; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "kemasyarakatan", label: "Kemasyarakatan" },
  { value: "ekonomi", label: "Ekonomi" },
  { value: "pendidikan", label: "Pendidikan" },
  { value: "keamanan", label: "Keamanan" },
];

export function LembagaExplorer({ data }: { data: Lembaga[] }) {
  const [active, setActive] = useState<LembagaKategori | "semua">("semua");

  const filtered = (active === "semua" ? data : data.filter((item) => item.kategori === active))
    .slice()
    .sort((a, b) => a.urutan - b.urutan);

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
        {filtered.length === 0 ? (
          <EmptyState icon={<FileQuestion />} message="Belum ada data tersedia" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-kakao-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <h3 className="font-heading text-lg font-semibold text-espresso-950">
                  {item.nama}
                </h3>
                {item.dasar_hukum && (
                  <p className="mt-1 text-xs text-espresso-800/60">
                    Dasar hukum: {item.dasar_hukum}
                  </p>
                )}
                {item.jumlah_pengurus !== null && (
                  <p className="mt-1 text-sm text-espresso-800/70">
                    {item.jumlah_pengurus} pengurus
                  </p>
                )}
                {item.keterangan && (
                  <p className="mt-2 text-sm leading-relaxed text-espresso-800/70">
                    {item.keterangan}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
