"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteStatistikAction } from "@/lib/actions/statistik";

export function DeleteStatistikButton({ id, label }: { id: string; label: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Hapus statistik "${label}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    startTransition(async () => {
      await deleteStatistikAction(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Hapus ${label}`}
      className="rounded-md p-1.5 text-espresso-800/40 transition-colors duration-200 hover:bg-tanah-100 hover:text-tanah-500 disabled:opacity-50"
    >
      <Trash2 className="size-4" />
    </button>
  );
}
