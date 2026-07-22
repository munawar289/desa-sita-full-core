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
                ? "bg-primary text-on-primary"
                : "border border-border text-text-muted hover:bg-surface-alt",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left">
          <thead className="bg-surface-alt">
            <tr>
              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                Kode
              </th>
              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                Sektor Usaha
              </th>
              <th className="px-3 py-2 text-right text-xs font-mono uppercase tracking-wider text-text-muted">
                Nilai (Ribu Rupiah)
              </th>
              <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
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
