"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLembagaAction, type LembagaActionState } from "@/lib/actions/lembaga";
import type { LembagaKategori } from "@/lib/data/lembaga";

const initialState: LembagaActionState = { error: null };

const KATEGORI_OPTIONS: LembagaKategori[] = ["kemasyarakatan", "ekonomi", "pendidikan", "keamanan"];

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AddLembagaForm({ defaultKategori }: { defaultKategori?: LembagaKategori }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createLembagaAction, initialState);

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
        Tambah Lembaga
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-xl border border-border bg-surface-alt p-4 sm:grid-cols-2 lg:grid-cols-6"
    >
      <div className="space-y-1">
        <Label className="text-xs">Kategori</Label>
        <select name="kategori" defaultValue={defaultKategori} className={selectClassName}>
          {KATEGORI_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-lembaga-nama" className="text-xs">
          Nama
        </Label>
        <Input id="new-lembaga-nama" name="nama" placeholder="PKK" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-lembaga-dasar" className="text-xs">
          Dasar Hukum
        </Label>
        <Input id="new-lembaga-dasar" name="dasar_hukum" placeholder="SK Kepala Desa" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-lembaga-jumlah" className="text-xs">
          Jumlah Pengurus
        </Label>
        <Input id="new-lembaga-jumlah" name="jumlah_pengurus" inputMode="numeric" />
      </div>
      <div className="space-y-1 sm:col-span-2 lg:col-span-1">
        <Label htmlFor="new-lembaga-keterangan" className="text-xs">
          Keterangan
        </Label>
        <Input id="new-lembaga-keterangan" name="keterangan" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-lembaga-urutan" className="text-xs">
          Urutan
        </Label>
        <Input id="new-lembaga-urutan" name="urutan" type="number" defaultValue={1} required min={1} />
      </div>

      {state.error && (
        <p className="text-sm text-danger sm:col-span-2 lg:col-span-6">{state.error}</p>
      )}

      <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
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
