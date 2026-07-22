"use client";

import { useState } from "react";
import { Check, ChevronDown, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProdeskelResult = { nomor: number; bab: string; label: string; tersedia: boolean };

function groupByBab(results: ProdeskelResult[]) {
  const groups = new Map<string, ProdeskelResult[]>();
  for (const result of results) {
    const list = groups.get(result.bab) ?? [];
    list.push(result);
    groups.set(result.bab, list);
  }
  return groups;
}

export function IndeksProdeskelWidget({ results }: { results: ProdeskelResult[] }) {
  const [expanded, setExpanded] = useState(false);
  const total = results.length;
  const tersedia = results.filter((r) => r.tersedia).length;
  const persen = Math.round((tersedia / total) * 1000) / 10;
  const grouped = groupByBab(results);

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
            Indeks Ketersediaan Data Prodeskel
          </p>
          <p className="mt-1 font-heading text-4xl font-semibold text-text">
            {tersedia}
            <span className="ml-1 text-xl font-normal text-text-muted">
              dari {total} kategori
            </span>
          </p>
          <p className="mt-1 text-sm text-text-muted">
            {persen}% data Profil Desa/Kelurahan (Permendagri 12/2007) sudah tersedia di situs
            ini — termasuk yang belum, biar transparan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 text-sm font-medium text-link transition-colors duration-200 hover:bg-primary-soft hover:text-on-primary-soft"
        >
          {expanded ? "Sembunyikan rincian" : "Lihat rincian 37 kategori"}
          <ChevronDown className={cn("size-4 transition-transform duration-200", expanded && "rotate-180")} />
        </button>
      </div>

      {expanded && (
        <div className="mt-6 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
          {[...grouped.entries()].map(([bab, items]) => (
            <div key={bab}>
              <h3 className="font-mono text-xs uppercase tracking-wider text-text-muted">{bab}</h3>
              <ul className="mt-2 space-y-1.5">
                {items.map((item) => (
                  <li key={item.nomor} className="flex items-center gap-2 text-sm">
                    {/* Ikon centang/lingkaran adalah satu-satunya penanda status,
                        jadi statusnya diucapkan juga lewat teks tersembunyi —
                        warna dan bentuk saja tidak cukup (WCAG 1.4.1). */}
                    {item.tersedia ? (
                      <Check className="size-4 shrink-0 text-success" aria-hidden />
                    ) : (
                      <Circle className="size-4 shrink-0 text-text-muted" aria-hidden />
                    )}
                    <span className="sr-only">
                      {item.tersedia ? "Sudah tersedia:" : "Belum tersedia:"}
                    </span>
                    <span className={item.tersedia ? "text-text" : "text-text-muted"}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
