"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  inviteTenantAdminAction,
  type PlatformInviteActionState,
} from "@/lib/actions/platform-tenants";

const initialState: PlatformInviteActionState = { error: null };
const inputClassName =
  "h-11 rounded-lg border-plat-outline text-plat-on-surface placeholder:text-plat-on-surface-variant/60 focus-visible:border-plat-primary focus-visible:ring-plat-primary/30";

export function InviteAdminForm({ tenantId }: { tenantId: string }) {
  const [state, formAction, isPending] = useActionState(inviteTenantAdminAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="tenant_id" value={tenantId} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="email" className="text-plat-on-surface">
            Email Calon Admin
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@desa.go.id"
            required
            className={inputClassName}
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="password" className="text-plat-on-surface">
            Kata Sandi
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            required
            minLength={8}
            className={inputClassName}
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 shrink-0 gap-1.5 rounded-full bg-plat-primary px-5 text-plat-on-primary hover:bg-plat-primary/90"
        >
          <UserPlus className="size-4" strokeWidth={1.75} aria-hidden />
          {isPending ? "Menyimpan…" : "Tambah Admin"}
        </Button>
      </div>

      {state.error && (
        <p className="flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2 text-sm text-on-danger-soft">
          <AlertCircle className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-center gap-2 rounded-lg bg-success-soft px-3 py-2 text-sm text-on-success-soft">
          <CheckCircle2 className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
          Admin berhasil ditambahkan.
        </p>
      )}
    </form>
  );
}
