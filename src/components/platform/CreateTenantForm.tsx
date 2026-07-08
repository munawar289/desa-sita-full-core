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
        className="rounded-full bg-kopi-600 text-white hover:bg-kopi-600/90"
      >
        {isPending ? "Menyimpan…" : "Buat Tenant"}
      </Button>
      {state.error && (
        <p className="w-full rounded-lg bg-tanah-100 px-3 py-2 text-sm text-tanah-500 sm:w-auto">
          {state.error}
        </p>
      )}
    </form>
  );
}
