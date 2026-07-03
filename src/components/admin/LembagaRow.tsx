"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteLembagaAction,
  updateLembagaAction,
  type LembagaActionState,
} from "@/lib/actions/lembaga";
import { DeleteEntityButton } from "./DeleteEntityButton";
import type { Lembaga, LembagaKategori } from "@/lib/data/lembaga";

const initialState: LembagaActionState = { error: null };

const KATEGORI_OPTIONS: LembagaKategori[] = ["kemasyarakatan", "ekonomi", "pendidikan", "keamanan"];

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function LembagaRow({ item }: { item: Lembaga }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateLembagaAction, initialState);

  if (editing) {
    return (
      <tr className="bg-kopi-100/40">
        <td colSpan={6} className="px-3 py-3">
          <form action={formAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <input type="hidden" name="id" value={item.id} />
            <div>
              <label className="text-xs text-espresso-800/60">Kategori</label>
              <select name="kategori" defaultValue={item.kategori} className={selectClassName}>
                {KATEGORI_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-espresso-800/60">Nama</label>
              <Input name="nama" defaultValue={item.nama} required maxLength={120} />
            </div>
            <div>
              <label className="text-xs text-espresso-800/60">Dasar Hukum</label>
              <Input name="dasar_hukum" defaultValue={item.dasar_hukum ?? ""} maxLength={120} />
            </div>
            <div>
              <label className="text-xs text-espresso-800/60">Jumlah Pengurus</label>
              <Input
                name="jumlah_pengurus"
                defaultValue={item.jumlah_pengurus ?? ""}
                inputMode="numeric"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-xs text-espresso-800/60">Keterangan</label>
              <Input name="keterangan" defaultValue={item.keterangan ?? ""} maxLength={500} />
            </div>
            <div>
              <label className="text-xs text-espresso-800/60">Urutan</label>
              <Input name="urutan" type="number" defaultValue={item.urutan} required min={1} />
            </div>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
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
      <td className="px-3 py-2.5 text-sm text-espresso-950">{item.nama}</td>
      <td className="px-3 py-2.5 text-sm text-espresso-800/70">{item.dasar_hukum ?? "—"}</td>
      <td className="px-3 py-2.5 text-right font-mono text-sm text-espresso-950">
        {item.jumlah_pengurus ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-sm text-espresso-800/70">{item.keterangan ?? "—"}</td>
      <td className="px-3 py-2.5 text-center font-mono text-xs text-espresso-800/50">
        {item.urutan}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.nama}`}
            className="rounded-md p-1.5 text-kopi-600 transition-colors duration-200 hover:bg-kopi-100"
          >
            <Pencil className="size-4" />
          </button>
          <DeleteEntityButton id={item.id} label={item.nama} action={deleteLembagaAction} />
        </div>
      </td>
    </tr>
  );
}
