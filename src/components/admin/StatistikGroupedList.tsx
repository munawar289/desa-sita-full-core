"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AddStatistikForm } from "./AddStatistikForm";
import { AddStatistikItemForm } from "./AddStatistikItemForm";
import { highlightMatch, StatistikRow } from "./StatistikRow";
import type { Statistik } from "@/lib/data/statistik";

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

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
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const addFormRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = normalizeQuery(query);

  const allCategories = useMemo(() => [...groupByCategory(rows).keys()], [rows]);

  const { grouped, totalByCategory } = useMemo(() => {
    const totalByCategory = groupByCategory(rows);
    if (!normalizedQuery) {
      return { grouped: totalByCategory, totalByCategory };
    }
    const filtered = rows.filter(
      (row) =>
        row.category.toLowerCase().includes(normalizedQuery) ||
        row.key.toLowerCase().includes(normalizedQuery) ||
        row.label.toLowerCase().includes(normalizedQuery)
    );
    return { grouped: groupByCategory(filtered), totalByCategory };
  }, [rows, normalizedQuery]);

  function closeAddForm() {
    setAddingTo(null);
    setHasDraft(false);
  }

  function handleToggleAdd(category: string) {
    const switchingDraft = addingTo !== null && addingTo !== category && hasDraft;
    const closingDraft = addingTo === category && hasDraft;

    if ((switchingDraft || closingDraft) && !window.confirm("Batalkan input yang sedang diisi?")) {
      return;
    }

    if (addingTo === category) {
      closeAddForm();
      return;
    }

    setAddingTo(category);
    setHasDraft(false);
  }

  function scrollToAddForm() {
    const node = addFormRef.current;
    if (!node) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    node.querySelector<HTMLElement>("button, input")?.focus();
  }

  return (
    <div className="space-y-8">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kategori, key, atau label…"
          className="pl-9"
        />
      </div>

      {rows.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">
            Belum ada statistik. Tambah kategori pertama di bawah.
          </p>
          <button
            type="button"
            onClick={scrollToAddForm}
            className="mt-3 text-sm font-medium text-link hover:underline"
          >
            Tambah kategori
          </button>
        </div>
      )}

      {rows.length > 0 && grouped.size === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-sm text-text-muted">Tidak ada data yang cocok.</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-3 text-sm font-medium text-link hover:underline"
          >
            Hapus pencarian
          </button>
        </div>
      )}

      {[...grouped.entries()].map(([category, items]) => {
        const total = totalByCategory.get(category)?.length ?? items.length;
        const isAdding = addingTo === category;

        return (
          <section key={category} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <h2 className="font-mono text-xs uppercase tracking-wider text-text-muted">
                  {highlightMatch(category, normalizedQuery)}
                </h2>
                {normalizedQuery && (
                  <span className="text-xs text-text-muted">
                    {items.length} dari {total} cocok
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleToggleAdd(category)}
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-200 hover:bg-primary-soft/50",
                  isAdding ? "text-text-muted" : "text-link"
                )}
              >
                {isAdding ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
                {isAdding ? "Batal" : "Tambah"}
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <table className="w-full text-left">
                <thead className="bg-surface-alt">
                  <tr>
                    <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                      Label
                    </th>
                    <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                      Key
                    </th>
                    <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                      Nilai
                    </th>
                    <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                      Diperbarui
                    </th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <StatistikRow key={item.id} item={item} query={normalizedQuery} />
                  ))}
                  {isAdding && (
                    <AddStatistikItemForm
                      category={category}
                      onDone={closeAddForm}
                      onDirtyChange={setHasDraft}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <div ref={addFormRef}>
        <AddStatistikForm existingCategories={allCategories} />
      </div>
    </div>
  );
}
