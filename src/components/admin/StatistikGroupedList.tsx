"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddStatistikForm } from "./AddStatistikForm";
import { StatistikRow } from "./StatistikRow";
import type { Statistik } from "@/lib/data/statistik";

function groupByCategory(rows: Statistik[]) {
  const groups = new Map<string, Statistik[]>();
  for (const row of rows) {
    const list = groups.get(row.category) ?? [];
    list.push(row);
    groups.set(row.category, list);
  }
  return groups;
}

export function StatistikGroupedList({ rows }: { rows: Statistik[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? rows.filter((row) => {
        const q = query.trim().toLowerCase();
        return (
          row.category.toLowerCase().includes(q) ||
          row.key.toLowerCase().includes(q) ||
          row.label.toLowerCase().includes(q)
        );
      })
    : rows;

  const grouped = groupByCategory(filtered);
  const allCategories = [...groupByCategory(rows).keys()];

  return (
    <div className="space-y-8">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-espresso-800/40" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kategori, key, atau label…"
          className="pl-9"
        />
      </div>

      {grouped.size === 0 && (
        <p className="text-sm text-espresso-800/60">Tidak ada data yang cocok.</p>
      )}

      {[...grouped.entries()].map(([category, items]) => (
        <section key={category} className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-wider text-sawah-700">
            {category}
          </h2>
          <div className="overflow-hidden rounded-xl border border-kakao-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-kakao-100">
                <tr>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Label
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Key
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Nilai
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Diperbarui
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <StatistikRow key={`${item.id}:${item.updated_at}`} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <AddStatistikForm defaultCategory={allCategories[0]} />
    </div>
  );
}
