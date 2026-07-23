"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStatistikAction, type StatistikActionState } from "@/lib/actions/statistik";
import { slugify } from "@/lib/utils";

const initialState: StatistikActionState = { error: null };

/**
 * Form untuk kategori BARU yang belum ada di daftar (bukan menambah item ke
 * kategori existing — itu dipegang AddStatistikItemForm, dipicu dari tombol
 * "+ Tambah" tiap section). `existingCategories` cuma jadi saran autocomplete
 * (datalist), admin tetap bebas mengetik nama kategori baru.
 */
export function AddStatistikForm({ existingCategories }: { existingCategories: string[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createStatistikAction, initialState);
  const [category, setCategory] = useState("");
  const [label, setLabel] = useState("");
  const [keyOverride, setKeyOverride] = useState<string | null>(null);

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
        Tambah Kategori Baru
      </button>
    );
  }

  const categorySlug = slugify(category);
  const generatedKey = keyOverride ?? slugify(label);

  return (
    <form
      action={formAction}
      className="grid gap-3 rounded-xl border border-border bg-surface-alt p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="space-y-1">
        <Label htmlFor="new-category" className="text-xs">
          Kategori baru
        </Label>
        <Input
          id="new-category"
          list="existing-categories"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Kependudukan"
          required
        />
        <datalist id="existing-categories">
          {existingCategories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <input type="hidden" name="category" value={categorySlug} />
        <p className="text-[11px] text-text-muted">
          {category ? (
            <>
              Disimpan sebagai <span className="font-mono">{categorySlug || "—"}</span>
            </>
          ) : (
            "Nama kategori bebas, otomatis dirapikan"
          )}
        </p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-label" className="text-xs">
          Label
        </Label>
        <Input
          id="new-label"
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Total Penduduk"
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-value" className="text-xs">
          Nilai
        </Label>
        <Input id="new-value" name="value" placeholder="3.192" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="new-key" className="text-xs">
          Key {keyOverride === null && <span className="text-text-muted">(otomatis)</span>}
        </Label>
        {keyOverride === null ? (
          <button
            id="new-key"
            type="button"
            onClick={() => setKeyOverride(generatedKey)}
            className="flex h-8 w-full items-center rounded-lg border border-dashed border-border px-2.5 font-mono text-sm text-text-muted"
          >
            {generatedKey || "—"}
          </button>
        ) : (
          <Input
            id="new-key"
            value={keyOverride}
            onChange={(e) => setKeyOverride(slugify(e.target.value))}
            className="font-mono"
          />
        )}
        <input type="hidden" name="key" value={generatedKey} />
      </div>

      {state.error && (
        <p className="text-sm text-danger sm:col-span-2 lg:col-span-4">{state.error}</p>
      )}

      <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !categorySlug || !generatedKey}
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
