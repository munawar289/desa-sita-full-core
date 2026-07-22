"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, type SignInState } from "@/lib/actions/auth";

const initialState: SignInState = { error: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nama@desasita.go.id"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-on-danger-soft">
          {state.error}
        </p>
      )}

      {/* Varian default Button sudah = tombol primer engine (bg-primary +
          on-primary + state hover/active dari token); tak perlu ditimpa. */}
      <Button type="submit" disabled={isPending} className="w-full rounded-full">
        {isPending ? "Memproses…" : "Masuk"}
      </Button>
    </form>
  );
}
