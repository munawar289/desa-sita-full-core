"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateStatistikAction, type StatistikActionState } from "@/lib/actions/statistik";
import { DeleteStatistikButton } from "./DeleteStatistikButton";
import type { Statistik } from "@/lib/data/statistik";

const initialState: StatistikActionState = { error: null };

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Bungkus substring yang cocok dengan `query` dalam <mark>, case-insensitive. */
export function highlightMatch(text: string, query: string): ReactNode {
  if (!query) return text;
  const pattern = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = text.split(pattern);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-yellow-200/40 px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// Baris ini derived dari `desa_profil.jumlah_rt` (Identitas Desa) — PRD
// jumlah-rt-dinamis §K4. Edit/hapus manual dikunci di sini supaya tidak ada
// dua angka RT yang bisa saling drift di halaman publik keamanan-kelembagaan.
export function isLockedRtRow(item: Pick<Statistik, "category" | "key">) {
  return item.category === "lembaga_kemasyarakatan" && item.key === "rt";
}

export function StatistikRow({ item, query = "" }: { item: Statistik; query?: string }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateStatistikAction, initialState);
  const locked = isLockedRtRow(item);

  if (editing) {
    return (
      <tr className="bg-surface-alt">
        <td colSpan={5} className="px-3 py-3">
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="category" value={item.category} />
            <input type="hidden" name="key" value={item.key} />
            <div className="min-w-[160px] flex-1">
              <label className="text-xs text-text-muted">Label</label>
              <Input name="label" defaultValue={item.label} required maxLength={120} />
            </div>
            <div className="min-w-[120px] flex-1">
              <label className="text-xs text-text-muted">Nilai</label>
              <Input name="value" defaultValue={item.value} required maxLength={120} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isPending} className="rounded-full">
                {isPending ? "Menyimpan…" : "Simpan"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setEditing(false)}
                className="rounded-full"
              >
                Batal
              </Button>
            </div>
          </form>
          {state.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-3 py-2.5 text-sm text-text">{highlightMatch(item.label, query)}</td>
      <td className="px-3 py-2.5 font-mono text-xs text-text-muted">
        {highlightMatch(item.key, query)}
      </td>
      <td className="px-3 py-2.5 font-mono text-sm font-semibold text-text">
        {item.value}
      </td>
      <td className="px-3 py-2.5 text-xs text-text-muted">
        {formatTanggal(item.updated_at)}
      </td>
      <td className="px-3 py-2.5">
        {locked ? (
          <div className="flex items-center justify-end">
            <span className="rounded-full bg-surface-alt px-2 py-0.5 text-[0.7rem] text-text-muted">
              Otomatis dari Identitas Desa
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label={`Edit ${item.label}`}
              className="rounded-md p-1.5 text-primary transition-colors duration-200 hover:bg-primary-soft"
            >
              <Pencil className="size-4" />
            </button>
            <DeleteStatistikButton id={item.id} label={item.label} />
          </div>
        )}
      </td>
    </tr>
  );
}
