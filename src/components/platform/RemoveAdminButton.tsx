"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { removeTenantAdminAction } from "@/lib/actions/platform-tenants";

export function RemoveAdminButton({
  tenantId,
  membershipId,
  adminName,
}: {
  tenantId: string;
  membershipId: string;
  adminName: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Hapus akses admin "${adminName}" dari tenant ini?`)) {
      return;
    }
    startTransition(async () => {
      await removeTenantAdminAction(tenantId, membershipId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Hapus akses admin ${adminName}`}
      className="flex size-8 shrink-0 items-center justify-center rounded-full text-plat-on-surface-variant transition-colors hover:bg-danger-soft hover:text-on-danger-soft disabled:opacity-50"
    >
      <Trash2 className="size-4" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
