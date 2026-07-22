"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateStatistikSektorUsahaAction,
  type StatistikSektorUsahaActionState,
} from "@/lib/actions/statistik-sektor-usaha";
import type { StatistikSektorUsaha } from "@/lib/data/statistik-sektor-usaha";

const initialState: StatistikSektorUsahaActionState = { error: null };

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function StatistikSektorUsahaRow({ item }: { item: StatistikSektorUsaha }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateStatistikSektorUsahaAction,
    initialState,
  );

  if (editing) {
    return (
      <tr className="bg-surface-alt">
        <td colSpan={5} className="px-3 py-3">
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={item.id} />
            <div className="w-48">
              <label className="text-xs text-text-muted">Nilai (ribu rupiah)</label>
              <Input
                name="nilai_ribu_rupiah"
                defaultValue={item.nilai_ribu_rupiah ?? ""}
                inputMode="decimal"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="rounded-full"
              >
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
      <td className="px-3 py-2.5 font-mono text-xs text-text-muted">{item.kode}</td>
      <td className="px-3 py-2.5 text-sm text-text">{item.nama}</td>
      <td className="px-3 py-2.5 text-right font-mono text-sm font-semibold text-text">
        {item.nilai_ribu_rupiah ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-xs text-text-muted">{formatTanggal(item.updated_at)}</td>
      <td className="px-3 py-2.5">
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Edit ${item.nama}`}
          className="rounded-md p-1.5 text-primary transition-colors duration-200 hover:bg-primary-soft"
        >
          <Pencil className="size-4" />
        </button>
      </td>
    </tr>
  );
}
