"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateStatistikRtDetailAction,
  updateStatistikRtValueAction,
  type StatistikRtActionState,
} from "@/lib/actions/statistik-rt";
import { DETAIL_FIELDS } from "@/lib/validation/statistik-rt";
import type { StatistikRt } from "@/lib/data/statistik-rt";

const initialState: StatistikRtActionState = { error: null };

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function StatistikRtRow({ item }: { item: StatistikRt }) {
  const [editing, setEditing] = useState(false);
  const detailFields = DETAIL_FIELDS[item.category];
  const action = detailFields ? updateStatistikRtDetailAction : updateStatistikRtValueAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const colSpan = detailFields ? detailFields.length + 3 : 4;

  if (editing) {
    return (
      <tr className="bg-surface-alt">
        <td colSpan={colSpan} className="px-3 py-3">
          <form action={formAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="category" value={item.category} />
            {detailFields ? (
              detailFields.map((field) => (
                <div key={field.key} className="w-24">
                  <label className="text-xs text-text-muted">{field.label}</label>
                  <Input
                    name={`detail_${field.key}`}
                    defaultValue={item.detail?.[field.key] ?? ""}
                    inputMode="decimal"
                  />
                </div>
              ))
            ) : (
              <div className="w-32">
                <label className="text-xs text-text-muted">Nilai</label>
                <Input name="value" defaultValue={item.value ?? ""} inputMode="decimal" />
              </div>
            )}
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
          </form>
          {state.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-3 py-2.5 text-sm text-text">{item.rt_nama}</td>
      {detailFields ? (
        detailFields.map((field) => (
          <td
            key={field.key}
            className="px-3 py-2.5 text-right font-mono text-sm text-text"
          >
            {item.detail?.[field.key] ?? "—"}
          </td>
        ))
      ) : (
        <td className="px-3 py-2.5 text-right font-mono text-sm font-semibold text-text">
          {item.value ?? "—"}
        </td>
      )}
      <td className="px-3 py-2.5 text-xs text-text-muted">{formatTanggal(item.updated_at)}</td>
      <td className="px-3 py-2.5">
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Edit ${item.rt_nama}`}
          className="rounded-md p-1.5 text-primary transition-colors duration-200 hover:bg-primary-soft"
        >
          <Pencil className="size-4" />
        </button>
      </td>
    </tr>
  );
}
