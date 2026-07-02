"use client";

import { useActionState, useState } from "react";
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

export function StatistikRow({ item }: { item: Statistik }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateStatistikAction, initialState);

  if (editing) {
    return (
      <tr className="bg-kopi-100/40">
        <td colSpan={5} className="px-3 py-3">
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="category" value={item.category} />
            <input type="hidden" name="key" value={item.key} />
            <div className="min-w-[160px] flex-1">
              <label className="text-xs text-espresso-800/60">Label</label>
              <Input name="label" defaultValue={item.label} required maxLength={120} />
            </div>
            <div className="min-w-[120px] flex-1">
              <label className="text-xs text-espresso-800/60">Nilai</label>
              <Input name="value" defaultValue={item.value} required maxLength={120} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isPending} className="rounded-full bg-kopi-600 hover:bg-kopi-600/90">
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
      <td className="px-3 py-2.5 text-sm text-espresso-950">{item.label}</td>
      <td className="px-3 py-2.5 font-mono text-xs text-espresso-800/60">{item.key}</td>
      <td className="px-3 py-2.5 font-mono text-sm font-semibold text-espresso-950">
        {item.value}
      </td>
      <td className="px-3 py-2.5 text-xs text-espresso-800/50">
        {formatTanggal(item.updated_at)}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.label}`}
            className="rounded-md p-1.5 text-kopi-600 transition-colors duration-200 hover:bg-kopi-100"
          >
            <Pencil className="size-4" />
          </button>
          <DeleteStatistikButton id={item.id} label={item.label} />
        </div>
      </td>
    </tr>
  );
}
