"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createWilayahInfoAction, type WilayahInfoActionState } from "@/lib/actions/wilayah-info";

const initialState: WilayahInfoActionState = { error: null };

export function AddWilayahInfoForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createWilayahInfoAction, initialState);

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
        Tambah Section
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-kakao-200 bg-kopi-100/30 p-4">
      <div className="space-y-1">
        <Label htmlFor="new-wilinfo-section" className="text-xs">
          Section (key, huruf kecil & underscore)
        </Label>
        <Input id="new-wilinfo-section" name="section" placeholder="potensi_wisata" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-wilinfo-konten" className="text-xs">
          Konten
        </Label>
        <Textarea id="new-wilinfo-konten" name="konten" required rows={4} />
      </div>

      {state.error && <p className="text-sm text-tanah-500">{state.error}</p>}

      <div className="flex gap-2">
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
