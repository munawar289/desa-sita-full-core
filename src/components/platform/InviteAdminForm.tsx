"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  inviteTenantAdminAction,
  type PlatformInviteActionState,
} from "@/lib/actions/platform-tenants";

const initialState: PlatformInviteActionState = { error: null };

export function InviteAdminForm({ tenantId }: { tenantId: string }) {
  const [state, formAction, isPending] = useActionState(inviteTenantAdminAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <input type="hidden" name="tenant_id" value={tenantId} />
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="email">Email Calon Admin</Label>
        <Input id="email" name="email" type="email" placeholder="admin@desa.go.id" required />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-kopi-600 text-white hover:bg-kopi-600/90"
      >
        {isPending ? "Mengirim…" : "Undang Admin"}
      </Button>
      {state.success && (
        <p className="w-full text-sm text-sawah-700 sm:w-auto">Berhasil ditambahkan.</p>
      )}
      {state.error && (
        <p className="w-full rounded-lg bg-tanah-100 px-3 py-2 text-sm text-tanah-500 sm:w-auto">
          {state.error}
        </p>
      )}
    </form>
  );
}
