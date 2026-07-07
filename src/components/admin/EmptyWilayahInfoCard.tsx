"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createWilayahInfoAction, type WilayahInfoActionState } from "@/lib/actions/wilayah-info";
import type { WilayahInfoPreset } from "@/lib/data/wilayah-info-sections";

const initialState: WilayahInfoActionState = { error: null };

/** Kartu untuk section baku (lihat WILAYAH_INFO_PRESETS) yang belum punya baris di DB. */
export function EmptyWilayahInfoCard({ preset }: { preset: WilayahInfoPreset }) {
  const { key: sectionKey, label, page, eyebrow, judul, urutan } = preset;
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createWilayahInfoAction, initialState);

  if (!open) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-dashed border-kakao-200 bg-white p-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-sawah-700">{label}</p>
          <p className="mt-1 text-sm text-espresso-800/50">Belum diisi.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-kakao-200 px-3 py-1.5 text-sm font-medium text-kopi-600 transition-all duration-200 hover:border-kopi-400 hover:bg-kopi-100/50"
        >
          <Plus className="size-4" />
          Isi Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-kakao-200 bg-kopi-100/40 p-4">
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="section" value={sectionKey} />
        <input type="hidden" name="page" value={page} />
        <input type="hidden" name="eyebrow" value={eyebrow} />
        <input type="hidden" name="judul" value={judul} />
        <input type="hidden" name="urutan" value={urutan} />
        <p className="font-mono text-xs uppercase tracking-wider text-sawah-700">{label}</p>
        <Textarea name="konten" required rows={4} placeholder={`Tulis ${label.toLowerCase()}…`} />
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
            onClick={() => setOpen(false)}
            className="rounded-full"
          >
            Batal
          </Button>
        </div>
        {state.error && <p className="text-sm text-tanah-500">{state.error}</p>}
      </form>
    </div>
  );
}
