"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createKepalaDesaRiwayatAction,
  type KepalaDesaRiwayatActionState,
} from "@/lib/actions/kepala-desa-riwayat";

const initialState: KepalaDesaRiwayatActionState = { error: null };

export function AddKepalaDesaForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createKepalaDesaRiwayatAction,
    initialState,
  );

  if (state.success && open) {
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-link transition-all duration-200 hover:border-border-strong hover:bg-primary-soft/50"
      >
        <Plus className="size-4" />
        Tambah Riwayat Kepala Desa
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-xl border border-border bg-surface-alt p-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <div className="space-y-1">
        <Label htmlFor="new-kades-nama" className="text-xs">
          Nama
        </Label>
        <Input id="new-kades-nama" name="nama" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-kades-mulai" className="text-xs">
          Mulai Menjabat
        </Label>
        <Input id="new-kades-mulai" name="periode_mulai" type="number" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-kades-selesai" className="text-xs">
          Selesai
        </Label>
        <Input id="new-kades-selesai" name="periode_selesai" type="number" placeholder="masih menjabat" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-kades-keterangan" className="text-xs">
          Keterangan
        </Label>
        <Input id="new-kades-keterangan" name="keterangan" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-kades-urutan" className="text-xs">
          Urutan
        </Label>
        <Input id="new-kades-urutan" name="urutan" type="number" defaultValue={1} required min={1} />
      </div>

      {state.error && (
        <p className="text-sm text-danger sm:col-span-2 lg:col-span-5">{state.error}</p>
      )}

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
          className="rounded-full"
          onClick={() => setOpen(false)}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
