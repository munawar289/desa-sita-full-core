"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTenantAction, type PlatformTenantActionState } from "@/lib/actions/platform-tenants";

const initialState: PlatformTenantActionState = { error: null };

export function CreateTenantForm() {
  const [state, formAction, isPending] = useActionState(createTenantAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" placeholder="contoh-desa" required />
      </div>
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="nama">Nama Desa</Label>
        <Input id="nama" name="nama" placeholder="Desa Contoh" required />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-plat-primary text-plat-on-primary hover:bg-plat-primary/90"
      >
        {isPending ? "Menyimpan…" : "Buat Tenant"}
      </Button>
      {state.error && (
        <p className="w-full rounded-lg bg-plat-error-container px-3 py-2 text-sm text-plat-on-error-container sm:w-auto">
          {state.error}
        </p>
      )}
    </form>
  );
}
