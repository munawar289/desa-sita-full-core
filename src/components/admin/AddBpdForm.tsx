"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBpdAction, type BpdActionState } from "@/lib/actions/bpd";

const initialState: BpdActionState = { error: null };

export function AddBpdForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createBpdAction, initialState);

  if (state.success && open) {
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-kakao-200 px-4 py-2 text-sm font-medium text-kopi-600 transition-all duration-200 hover:border-kopi-400 hover:bg-kopi-100/50"
      >
        <Plus className="size-4" />
        Tambah Anggota BPD
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-xl border border-kakao-200 bg-kopi-100/30 p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="space-y-1">
        <Label htmlFor="new-bpd-nama" className="text-xs">
          Nama
        </Label>
        <Input id="new-bpd-nama" name="nama" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-bpd-jabatan" className="text-xs">
          Jabatan
        </Label>
        <Input id="new-bpd-jabatan" name="jabatan" placeholder="Anggota" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-bpd-pendidikan" className="text-xs">
          Pendidikan
        </Label>
        <Input id="new-bpd-pendidikan" name="pendidikan" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-bpd-urutan" className="text-xs">
          Urutan
        </Label>
        <Input id="new-bpd-urutan" name="urutan" type="number" defaultValue={1} required min={1} />
      </div>

      {state.error && (
        <p className="text-sm text-tanah-500 sm:col-span-2 lg:col-span-4">{state.error}</p>
      )}

      <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
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
          className="rounded-full"
          onClick={() => setOpen(false)}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
