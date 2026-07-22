"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAparaturAction, type AparaturActionState } from "@/lib/actions/aparatur";

const initialState: AparaturActionState = { error: null };

export function AddAparaturForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createAparaturAction, initialState);

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
        Tambah Perangkat
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-xl border border-border bg-surface-alt p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="space-y-1">
        <Label htmlFor="new-apr-nama" className="text-xs">
          Nama
        </Label>
        <Input id="new-apr-nama" name="nama" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-apr-jabatan" className="text-xs">
          Jabatan
        </Label>
        <Input id="new-apr-jabatan" name="jabatan" placeholder="Kaur Perencanaan" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-apr-pendidikan" className="text-xs">
          Pendidikan
        </Label>
        <Input id="new-apr-pendidikan" name="pendidikan" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-apr-urutan" className="text-xs">
          Urutan
        </Label>
        <Input id="new-apr-urutan" name="urutan" type="number" defaultValue={1} required min={1} />
      </div>

      {state.error && (
        <p className="text-sm text-danger sm:col-span-2 lg:col-span-4">{state.error}</p>
      )}

      <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
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
