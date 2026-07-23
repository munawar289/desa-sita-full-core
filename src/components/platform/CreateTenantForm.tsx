"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTenantAction, type PlatformTenantActionState } from "@/lib/actions/platform-tenants";

const initialState: PlatformTenantActionState = { error: null };

export function CreateTenantForm() {
  const [state, formAction, isPending] = useActionState(createTenantAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="slug" className="text-plat-on-surface">
            Slug
          </Label>
          <Input
            id="slug"
            name="slug"
            placeholder="contoh-desa"
            required
            className="h-11 rounded-lg border-plat-outline text-plat-on-surface placeholder:text-plat-on-surface-variant/60 focus-visible:border-plat-primary focus-visible:ring-plat-primary/30"
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="nama" className="text-plat-on-surface">
            Nama Desa
          </Label>
          <Input
            id="nama"
            name="nama"
            placeholder="Desa Contoh"
            required
            className="h-11 rounded-lg border-plat-outline text-plat-on-surface placeholder:text-plat-on-surface-variant/60 focus-visible:border-plat-primary focus-visible:ring-plat-primary/30"
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 shrink-0 gap-1.5 rounded-full bg-plat-primary px-5 text-plat-on-primary hover:bg-plat-primary/90"
        >
          <Plus className="size-4" strokeWidth={1.75} aria-hidden />
          {isPending ? "Menyimpan…" : "Buat Tenant"}
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
          Tenant berhasil dibuat.
        </p>
      )}
    </form>
  );
}
