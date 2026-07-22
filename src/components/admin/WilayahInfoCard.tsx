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

const initialState: WilayahInfoActionState = { error: null };

const selectClassName =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

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
      <div className="rounded-xl border border-border bg-surface-alt p-4">
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" value={item.id} />
          <div>
            <label className="text-xs text-text-muted">Section</label>
            <Input name="section" defaultValue={item.section} required maxLength={64} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-text-muted">Tampil di Halaman</label>
              <select name="page" defaultValue={item.page} className={selectClassName}>
                <option value="wilayah">Wilayah</option>
                <option value="sejarah">Sejarah</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted">Urutan</label>
              <Input name="urutan" type="number" defaultValue={item.urutan} required min={0} />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted">Label Kecil (eyebrow)</label>
            <Input name="eyebrow" defaultValue={item.eyebrow} required maxLength={40} />
          </div>
          <div>
            <label className="text-xs text-text-muted">Judul</label>
            <Input name="judul" defaultValue={item.judul} required maxLength={80} />
          </div>
          <div>
            <label className="text-xs text-text-muted">Konten</label>
            <Textarea name="konten" defaultValue={item.konten} required rows={4} />
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
          {state.error && <p className="text-sm text-danger">{state.error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
            {item.eyebrow} · {item.judul}
            <span className="ml-2 rounded-full bg-surface-alt px-2 py-0.5 normal-case tracking-normal text-text-muted">
              {item.page === "wilayah" ? "Wilayah" : "Sejarah"}
            </span>
          </p>
          <p className="mt-1 text-sm text-text">{item.konten}</p>
          <p className="mt-2 text-xs text-text-muted">
            Diperbarui {formatTanggal(item.updated_at)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.section}`}
            className="rounded-md p-1.5 text-primary transition-colors duration-200 hover:bg-primary-soft"
          >
            <Pencil className="size-4" />
          </button>
          <DeleteEntityButton id={item.id} label={item.section} action={deleteWilayahInfoAction} />
        </div>
      </div>
    </div>
  );
}
