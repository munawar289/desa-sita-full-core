"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signInAction, type SignInState } from "@/lib/actions/auth";

const initialState: SignInState = { error: null };

const fieldClassName = "h-11 px-3.5";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          placeholder="nama@desasita.go.id"
          aria-invalid={!!state.error}
          className={fieldClassName}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Kata Sandi</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={!!state.error}
            aria-describedby={state.error ? "password-error" : undefined}
            className={cn(fieldClassName, "pr-11")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-muted transition-colors hover:text-link"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {state.error && (
        <div
          id="password-error"
          role="alert"
          className="flex items-start gap-2.5 rounded-lg bg-danger-soft px-3.5 py-3 text-sm text-on-danger-soft"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>{state.error}</p>
        </div>
      )}

      {/* Varian default Button sudah = tombol primer engine (bg-primary +
          on-primary + state hover/active dari token); tak perlu ditimpa.
          Shadow + hover lift mengikuti resep CTA utama Hero beranda. */}
      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full gap-2 rounded-full shadow-lg shadow-neutral-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neutral-900/30 disabled:hover:translate-y-0"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Memproses…
          </>
        ) : (
          "Masuk"
        )}
      </Button>
    </form>
  );
}
