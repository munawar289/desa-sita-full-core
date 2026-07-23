import type { Metadata } from "next";
import { KeyRound } from "lucide-react";
import { SetPasswordForm } from "@/components/SetPasswordForm";

export const metadata: Metadata = {
  title: "Atur Kata Sandi",
  robots: { index: false, follow: false },
};

export default function SetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-panel-strong px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-accent-300 to-accent-500 text-neutral-900">
            <KeyRound className="size-6" />
          </span>
          <h1 className="mt-4 font-heading text-xl font-semibold text-text">
            Atur Kata Sandi
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Buat kata sandi untuk akun undangan Anda
          </p>
        </div>

        <div className="mt-8">
          <SetPasswordForm />
        </div>
      </div>
    </div>
  );
}
