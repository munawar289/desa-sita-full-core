"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPotensiAction, type PotensiActionState } from "@/lib/actions/potensi";
import { POTENSI_ICON_OPTIONS } from "@/lib/data/potensi";

const initialState: PotensiActionState = { error: null };

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AddPotensiForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createPotensiAction, initialState);

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
        Tambah Potensi
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-xl border border-kakao-200 bg-kopi-100/30 p-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <div className="space-y-1">
        <Label htmlFor="new-potensi-judul" className="text-xs">
          Judul
        </Label>
        <Input id="new-potensi-judul" name="judul" placeholder="Perikanan" required />
      </div>
      <div className="space-y-1 sm:col-span-2 lg:col-span-2">
        <Label htmlFor="new-potensi-deskripsi" className="text-xs">
          Deskripsi
        </Label>
        <Input id="new-potensi-deskripsi" name="deskripsi" required />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Ikon</Label>
        <select name="icon" defaultValue={POTENSI_ICON_OPTIONS[0]} className={selectClassName}>
          {POTENSI_ICON_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-potensi-urutan" className="text-xs">
          Urutan
        </Label>
        <Input id="new-potensi-urutan" name="urutan" type="number" defaultValue={1} required min={1} />
      </div>

      {state.error && (
        <p className="text-sm text-tanah-500 sm:col-span-2 lg:col-span-5">{state.error}</p>
      )}

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
          className="rounded-full"
          onClick={() => setOpen(false)}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
