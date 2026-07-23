"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createWilayahInfoAction, type WilayahInfoActionState } from "@/lib/actions/wilayah-info";

const initialState: WilayahInfoActionState = { error: null };

const selectClassName =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

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
        className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-link transition-all duration-200 hover:border-border-strong hover:bg-primary-soft/50"
      >
        <Plus className="size-4" />
        Tambah Section
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-border bg-surface-alt p-4">
      <div className="space-y-1">
        <Label htmlFor="new-wilinfo-section" className="text-xs">
          Section (key, huruf kecil & underscore)
        </Label>
        <Input id="new-wilinfo-section" name="section" placeholder="potensi_wisata" required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="new-wilinfo-page" className="text-xs">
            Tampil di Halaman
          </Label>
          <select id="new-wilinfo-page" name="page" defaultValue="wilayah" className={selectClassName}>
            <option value="wilayah">Wilayah</option>
            <option value="sejarah">Sejarah</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-wilinfo-urutan" className="text-xs">
            Urutan
          </Label>
          <Input id="new-wilinfo-urutan" name="urutan" type="number" defaultValue={99} required min={0} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-wilinfo-eyebrow" className="text-xs">
          Label Kecil (eyebrow)
        </Label>
        <Input id="new-wilinfo-eyebrow" name="eyebrow" placeholder="Pariwisata" required maxLength={40} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-wilinfo-judul" className="text-xs">
          Judul
        </Label>
        <Input id="new-wilinfo-judul" name="judul" placeholder="Potensi Wisata" required maxLength={80} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-wilinfo-konten" className="text-xs">
          Konten
        </Label>
        <Textarea id="new-wilinfo-konten" name="konten" required rows={4} />
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

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
          className="rounded-full"
          onClick={() => setOpen(false)}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
