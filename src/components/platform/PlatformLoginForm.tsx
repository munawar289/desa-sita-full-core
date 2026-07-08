"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { platformSignInAction, type PlatformSignInState } from "@/lib/actions/platform-auth";

const initialState: PlatformSignInState = { error: null };

const fieldClassName =
  "h-11 rounded-xl border-plat-outline-variant bg-white px-3.5 text-sm text-plat-on-surface placeholder:text-plat-on-surface-variant/50 focus-visible:border-plat-primary focus-visible:ring-plat-primary/20";

export function PlatformLoginForm() {
  const [state, formAction, isPending] = useActionState(platformSignInAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-plat-on-surface">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          placeholder="landlord@platform.id"
          className={fieldClassName}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-plat-on-surface">
          Kata Sandi
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={cn(fieldClassName, "pr-11")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-plat-on-surface-variant transition-colors hover:text-plat-primary"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl bg-plat-error-container px-3.5 py-3 text-sm text-plat-on-error-container"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-plat-primary text-sm font-semibold text-plat-on-primary shadow-sm shadow-plat-primary/25 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 focus-visible:ring-3 focus-visible:ring-plat-primary/30 disabled:pointer-events-none disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Memproses…
          </>
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
}
