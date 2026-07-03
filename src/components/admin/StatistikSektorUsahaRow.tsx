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
      <tr className="bg-kopi-100/40">
        <td colSpan={5} className="px-3 py-3">
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={item.id} />
            <div className="w-48">
              <label className="text-xs text-espresso-800/60">Nilai (ribu rupiah)</label>
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
                className="rounded-full bg-kopi-600 hover:bg-kopi-600/90"
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
          {state.error && <p className="mt-2 text-sm text-tanah-500">{state.error}</p>}
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-kakao-200 last:border-0">
      <td className="px-3 py-2.5 font-mono text-xs text-espresso-800/60">{item.kode}</td>
      <td className="px-3 py-2.5 text-sm text-espresso-950">{item.nama}</td>
      <td className="px-3 py-2.5 text-right font-mono text-sm font-semibold text-espresso-950">
        {item.nilai_ribu_rupiah ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-xs text-espresso-800/50">{formatTanggal(item.updated_at)}</td>
      <td className="px-3 py-2.5">
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Edit ${item.nama}`}
          className="rounded-md p-1.5 text-kopi-600 transition-colors duration-200 hover:bg-kopi-100"
        >
          <Pencil className="size-4" />
        </button>
      </td>
    </tr>
  );
}
