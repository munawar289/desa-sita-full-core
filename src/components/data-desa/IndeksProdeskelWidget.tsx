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
    <div className="rounded-xl border border-kakao-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-sawah-700">
            Indeks Ketersediaan Data Prodeskel
          </p>
          <p className="mt-1 font-heading text-4xl font-semibold text-espresso-950">
            {tersedia}
            <span className="ml-1 text-xl font-normal text-espresso-800/50">
              dari {total} kategori
            </span>
          </p>
          <p className="mt-1 text-sm text-espresso-800/60">
            {persen}% data Profil Desa/Kelurahan (Permendagri 12/2007) sudah tersedia di situs
            ini — termasuk yang belum, biar transparan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-kakao-200 px-4 py-2 text-sm font-medium text-kopi-600 transition-colors duration-200 hover:bg-kopi-100/50"
        >
          {expanded ? "Sembunyikan rincian" : "Lihat rincian 37 kategori"}
          <ChevronDown className={cn("size-4 transition-transform duration-200", expanded && "rotate-180")} />
        </button>
      </div>

      {expanded && (
        <div className="mt-6 grid gap-6 border-t border-kakao-200 pt-6 sm:grid-cols-2">
          {[...grouped.entries()].map(([bab, items]) => (
            <div key={bab}>
              <h3 className="font-mono text-xs uppercase tracking-wider text-sawah-700">{bab}</h3>
              <ul className="mt-2 space-y-1.5">
                {items.map((item) => (
                  <li key={item.nomor} className="flex items-center gap-2 text-sm">
                    {item.tersedia ? (
                      <Check className="size-4 shrink-0 text-sawah-600" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-espresso-800/20" />
                    )}
                    <span className={item.tersedia ? "text-espresso-950" : "text-espresso-800/50"}>
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
