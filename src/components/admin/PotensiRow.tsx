"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deletePotensiAction,
  updatePotensiAction,
  type PotensiActionState,
} from "@/lib/actions/potensi";
import { DeleteEntityButton } from "./DeleteEntityButton";
import { POTENSI_ICON_OPTIONS, potensiIconMap, type Potensi } from "@/lib/data/potensi";

const initialState: PotensiActionState = { error: null };

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function PotensiRow({ item }: { item: Potensi }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updatePotensiAction, initialState);
  const Icon = potensiIconMap[item.icon];

  if (editing) {
    return (
      <tr className="bg-surface-alt">
        <td colSpan={5} className="px-3 py-3">
          <form action={formAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input type="hidden" name="id" value={item.id} />
            <div>
              <label className="text-xs text-text-muted">Judul</label>
              <Input name="judul" defaultValue={item.judul} required maxLength={60} />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-xs text-text-muted">Deskripsi</label>
              <Input name="deskripsi" defaultValue={item.deskripsi} required maxLength={300} />
            </div>
            <div>
              <label className="text-xs text-text-muted">Ikon</label>
              <select name="icon" defaultValue={item.icon} className={selectClassName}>
                {POTENSI_ICON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted">Urutan</label>
              <Input name="urutan" type="number" defaultValue={item.urutan} required min={1} />
            </div>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
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
      <td className="px-3 py-2.5 text-sm text-text">{item.judul}</td>
      <td className="px-3 py-2.5 text-sm text-text-muted">{item.deskripsi}</td>
      <td className="px-3 py-2.5 text-sm text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Icon className="size-4" />
          {item.icon}
        </span>
      </td>
      <td className="px-3 py-2.5 text-center font-mono text-xs text-text-muted">
        {item.urutan}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.judul}`}
            className="rounded-md p-1.5 text-primary transition-colors duration-200 hover:bg-primary-soft"
          >
            <Pencil className="size-4" />
          </button>
          <DeleteEntityButton id={item.id} label={item.judul} action={deletePotensiAction} />
        </div>
      </td>
    </tr>
  );
}
