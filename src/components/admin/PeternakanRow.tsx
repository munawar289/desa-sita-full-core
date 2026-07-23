"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deletePeternakanAction,
  updatePeternakanAction,
  type PeternakanActionState,
} from "@/lib/actions/peternakan";
import { DeleteEntityButton } from "./DeleteEntityButton";
import type { Peternakan } from "@/lib/data/peternakan";

const initialState: PeternakanActionState = { error: null };

export function PeternakanRow({ item }: { item: Peternakan }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updatePeternakanAction, initialState);

  if (editing) {
    return (
      <tr className="bg-surface-alt">
        <td colSpan={5} className="px-3 py-3">
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={item.id} />
            <div className="min-w-[140px] flex-1">
              <label className="text-xs text-text-muted">Jenis Ternak</label>
              <Input name="jenis_ternak" defaultValue={item.jenis_ternak} required maxLength={120} />
            </div>
            <div className="w-28">
              <label className="text-xs text-text-muted">Populasi</label>
              <Input name="populasi" defaultValue={item.populasi ?? ""} inputMode="numeric" />
            </div>
            <div className="w-32">
              <label className="text-xs text-text-muted">Jumlah Pemilik</label>
              <Input
                name="jumlah_pemilik"
                defaultValue={item.jumlah_pemilik ?? ""}
                inputMode="numeric"
              />
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
      <td className="px-3 py-2.5 text-sm text-text">{item.jenis_ternak}</td>
      <td className="px-3 py-2.5 text-right font-mono text-sm text-text">
        {item.populasi ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-right font-mono text-sm text-text">
        {item.jumlah_pemilik ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-center font-mono text-xs text-text-muted">
        {item.urutan}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.jenis_ternak}`}
            className="rounded-md p-1.5 text-primary transition-colors duration-200 hover:bg-primary-soft"
          >
            <Pencil className="size-4" />
          </button>
          <DeleteEntityButton
            id={item.id}
            label={item.jenis_ternak}
            action={deletePeternakanAction}
          />
        </div>
      </td>
    </tr>
  );
}
