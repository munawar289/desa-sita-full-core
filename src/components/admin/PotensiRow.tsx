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
      <tr className="bg-kopi-100/40">
        <td colSpan={5} className="px-3 py-3">
          <form action={formAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input type="hidden" name="id" value={item.id} />
            <div>
              <label className="text-xs text-espresso-800/60">Judul</label>
              <Input name="judul" defaultValue={item.judul} required maxLength={60} />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-xs text-espresso-800/60">Deskripsi</label>
              <Input name="deskripsi" defaultValue={item.deskripsi} required maxLength={300} />
            </div>
            <div>
              <label className="text-xs text-espresso-800/60">Ikon</label>
              <select name="icon" defaultValue={item.icon} className={selectClassName}>
                {POTENSI_ICON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-espresso-800/60">Urutan</label>
              <Input name="urutan" type="number" defaultValue={item.urutan} required min={1} />
            </div>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
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
      <td className="px-3 py-2.5 text-sm text-espresso-950">{item.judul}</td>
      <td className="px-3 py-2.5 text-sm text-espresso-800/70">{item.deskripsi}</td>
      <td className="px-3 py-2.5 text-sm text-espresso-800/70">
        <span className="inline-flex items-center gap-1.5">
          <Icon className="size-4" />
          {item.icon}
        </span>
      </td>
      <td className="px-3 py-2.5 text-center font-mono text-xs text-espresso-800/50">
        {item.urutan}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.judul}`}
            className="rounded-md p-1.5 text-kopi-600 transition-colors duration-200 hover:bg-kopi-100"
          >
            <Pencil className="size-4" />
          </button>
          <DeleteEntityButton id={item.id} label={item.judul} action={deletePotensiAction} />
        </div>
      </td>
    </tr>
  );
}
