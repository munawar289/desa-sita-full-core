"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStatistikAction, type StatistikActionState } from "@/lib/actions/statistik";
import { slugify } from "@/lib/utils";

const initialState: StatistikActionState = { error: null };

/**
 * Form tambah item di dalam kategori yang sudah ada. Kategori dikunci ke
 * `category` (tidak perlu diketik ulang), dan `key` diturunkan otomatis dari
 * Label supaya admin desa tidak perlu tahu aturan snake_case backend.
 */
export function AddStatistikItemForm({
  category,
  onDone,
  onDirtyChange,
}: {
  category: string;
  onDone: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(createStatistikAction, initialState);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [keyOverride, setKeyOverride] = useState<string | null>(null);

  if (state.success) {
    onDone();
  }

  const isDirty = label.trim() !== "" || value.trim() !== "" || keyOverride !== null;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const generatedKey = keyOverride ?? slugify(label);

  return (
    <tr className="bg-surface-alt">
      <td colSpan={5} className="px-3 py-3">
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="key" value={generatedKey} />
          <div className="min-w-[160px] flex-1">
            <Label htmlFor="item-label" className="text-xs">
              Label
            </Label>
            <Input
              id="item-label"
              name="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Total Penduduk"
              required
              maxLength={120}
              autoFocus
            />
          </div>
          <div className="min-w-[120px] flex-1">
            <Label htmlFor="item-value" className="text-xs">
              Nilai
            </Label>
            <Input
              id="item-value"
              name="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="3.192"
              required
              maxLength={120}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !generatedKey}
              className="rounded-full"
            >
              {isPending ? "Menyimpan…" : "Simpan"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onDone}
              className="rounded-full"
            >
              Batal
            </Button>
          </div>
        </form>

        <div className="mt-2 text-xs text-text-muted">
          Key: <span className="font-mono">{generatedKey || "—"}</span>{" "}
          {keyOverride === null ? (
            <button
              type="button"
              onClick={() => setKeyOverride(generatedKey)}
              className="text-link underline-offset-2 hover:underline"
            >
              ubah manual
            </button>
          ) : (
            <Input
              value={keyOverride}
              onChange={(e) => setKeyOverride(slugify(e.target.value))}
              className="mt-1 h-7 max-w-[200px] font-mono text-xs"
            />
          )}
        </div>
        {state.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
      </td>
    </tr>
  );
}
