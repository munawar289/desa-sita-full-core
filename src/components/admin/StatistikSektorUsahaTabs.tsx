"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StatistikSektorUsahaRow } from "./StatistikSektorUsahaRow";
import type { StatistikSektorUsaha } from "@/lib/data/statistik-sektor-usaha";

const TABS: { key: "pdb" | "pendapatan_riil"; label: string }[] = [
  { key: "pdb", label: "Produk Domestik Bruto" },
  { key: "pendapatan_riil", label: "Pendapatan Riil Keluarga" },
];

export function StatistikSektorUsahaTabs({ rows }: { rows: StatistikSektorUsaha[] }) {
  const [active, setActive] = useState<"pdb" | "pendapatan_riil">("pdb");
  const items = rows.filter((row) => row.jenis === active).sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
              active === tab.key
                ? "bg-kopi-600 text-white"
                : "border border-kakao-200 text-espresso-800/70 hover:bg-kakao-100",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-kakao-200 bg-white">
        <table className="w-full text-left">
          <thead className="bg-kakao-100">
            <tr>
              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                Kode
              </th>
              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                Sektor Usaha
              </th>
              <th className="px-3 py-2 text-right text-xs font-mono uppercase tracking-wider text-sawah-700">
                Nilai (Ribu Rupiah)
              </th>
              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                Diperbarui
              </th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <StatistikSektorUsahaRow key={`${item.id}:${item.updated_at}`} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
