"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteWilayahInfoAction,
  updateWilayahInfoAction,
  type WilayahInfoActionState,
} from "@/lib/actions/wilayah-info";
import { DeleteEntityButton } from "./DeleteEntityButton";
import type { WilayahInfo } from "@/lib/data/wilayah-info";
import { labelForSection } from "@/lib/data/wilayah-info-sections";

const initialState: WilayahInfoActionState = { error: null };

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function WilayahInfoCard({ item }: { item: WilayahInfo }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(updateWilayahInfoAction, initialState);

  if (editing) {
    return (
      <div className="rounded-xl border border-kakao-200 bg-kopi-100/40 p-4">
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" value={item.id} />
          <div>
            <label className="text-xs text-espresso-800/60">Section</label>
            <Input name="section" defaultValue={item.section} required maxLength={64} />
          </div>
          <div>
            <label className="text-xs text-espresso-800/60">Konten</label>
            <Textarea name="konten" defaultValue={item.konten} required rows={4} />
          </div>
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
              onClick={() => setEditing(false)}
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

  return (
    <div className="rounded-xl border border-kakao-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-sawah-700">
            {labelForSection(item.section)}
          </p>
          <p className="mt-1 text-sm text-espresso-800">{item.konten}</p>
          <p className="mt-2 text-xs text-espresso-800/50">
            Diperbarui {formatTanggal(item.updated_at)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.section}`}
            className="rounded-md p-1.5 text-kopi-600 transition-colors duration-200 hover:bg-kopi-100"
          >
            <Pencil className="size-4" />
          </button>
          <DeleteEntityButton id={item.id} label={item.section} action={deleteWilayahInfoAction} />
        </div>
      </div>
    </div>
  );
}
