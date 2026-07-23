"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteKepalaDesaRiwayatAction,
  updateKepalaDesaRiwayatAction,
  type KepalaDesaRiwayatActionState,
} from "@/lib/actions/kepala-desa-riwayat";
import { DeleteEntityButton } from "./DeleteEntityButton";
import type { KepalaDesaRiwayat } from "@/lib/data/kepala-desa-riwayat";

const initialState: KepalaDesaRiwayatActionState = { error: null };

export function KepalaDesaRow({ item }: { item: KepalaDesaRiwayat }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateKepalaDesaRiwayatAction,
    initialState,
  );

  if (editing) {
    return (
      <tr className="bg-surface-alt">
        <td colSpan={6} className="px-3 py-3">
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={item.id} />
            <div className="min-w-[160px] flex-1">
              <label className="text-xs text-text-muted">Nama</label>
              <Input name="nama" defaultValue={item.nama} required maxLength={120} />
            </div>
            <div className="w-28">
              <label className="text-xs text-text-muted">Mulai</label>
              <Input name="periode_mulai" type="number" defaultValue={item.periode_mulai} required />
            </div>
            <div className="w-28">
              <label className="text-xs text-text-muted">Selesai</label>
              <Input
                name="periode_selesai"
                type="number"
                defaultValue={item.periode_selesai ?? ""}
                placeholder="masih menjabat"
              />
            </div>
            <div className="min-w-[160px] flex-1">
              <label className="text-xs text-text-muted">Keterangan</label>
              <Input name="keterangan" defaultValue={item.keterangan ?? ""} maxLength={500} />
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
      <td className="px-3 py-2.5 text-center font-mono text-sm text-text-muted">
        {item.periode_mulai}
      </td>
      <td className="px-3 py-2.5 text-center font-mono text-sm text-text-muted">
        {item.periode_selesai ?? "sekarang"}
      </td>
      <td className="px-3 py-2.5 text-sm text-text-muted">{item.keterangan ?? "—"}</td>
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
          <DeleteEntityButton
            id={item.id}
            label={item.nama}
            action={deleteKepalaDesaRiwayatAction}
          />
        </div>
      </td>
    </tr>
  );
}
