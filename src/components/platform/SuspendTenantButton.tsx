"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateTenantStatusAction } from "@/lib/actions/platform-tenants";

export function SuspendTenantButton({
  tenantId,
  tenantName,
  nextStatus,
}: {
  tenantId: string;
  tenantName: string;
  nextStatus: "active" | "suspended";
}) {
  const [isPending, startTransition] = useTransition();
  const isSuspending = nextStatus === "suspended";

  function handleClick() {
    if (
      isSuspending &&
      !window.confirm(
        `Suspend tenant "${tenantName}"? Admin tenant ini tidak akan bisa mengakses dashboard sampai diaktifkan kembali.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      await updateTenantStatusAction(tenantId, nextStatus);
    });
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      variant={isSuspending ? "destructive" : "default"}
      className="rounded-full"
    >
      {isPending ? "Memproses…" : isSuspending ? "Suspend Tenant" : "Aktifkan Kembali"}
    </Button>
  );
}
