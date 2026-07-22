"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteKomoditasAction,
  updateKomoditasAction,
  type KomoditasActionState,
} from "@/lib/actions/komoditas";
import { DeleteEntityButton } from "./DeleteEntityButton";
import type { Komoditas } from "@/lib/data/komoditas";

const initialState: KomoditasActionState = { error: null };

export function KomoditasRow({ item }: { item: Komoditas }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateKomoditasAction, initialState);

  if (editing) {
    return (
      <tr className="bg-surface-alt">
        <td colSpan={5} className="px-3 py-3">
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={item.id} />
            <div className="min-w-[140px] flex-1">
              <label className="text-xs text-text-muted">Nama</label>
              <Input name="nama" defaultValue={item.nama} required maxLength={120} />
            </div>
            <div className="w-28">
              <label className="text-xs text-text-muted">Luas (Ha)</label>
              <Input name="luas_ha" defaultValue={item.luas_ha ?? ""} inputMode="decimal" />
            </div>
            <div className="min-w-[160px] flex-1">
              <label className="text-xs text-text-muted">Hasil Panen</label>
              <Input name="hasil_panen" defaultValue={item.hasil_panen ?? ""} maxLength={120} />
            </div>
            <div className="w-24">
              <label className="text-xs text-text-muted">Urutan</label>
              <Input name="urutan" type="number" defaultValue={item.urutan} required min={1} />
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
      <td className="px-3 py-2.5 text-sm text-text">{item.nama}</td>
      <td className="px-3 py-2.5 text-right font-mono text-sm text-text">
        {item.luas_ha ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-sm text-text-muted">{item.hasil_panen ?? "—"}</td>
      <td className="px-3 py-2.5 text-center font-mono text-xs text-text-muted">
        {item.urutan}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.nama}`}
            className="rounded-md p-1.5 text-primary transition-colors duration-200 hover:bg-primary-soft"
          >
            <Pencil className="size-4" />
          </button>
          <DeleteEntityButton id={item.id} label={item.nama} action={deleteKomoditasAction} />
        </div>
      </td>
    </tr>
  );
}
