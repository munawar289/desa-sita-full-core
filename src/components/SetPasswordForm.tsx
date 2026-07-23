"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type SessionState = "checking" | "ready" | "invalid";

export function SetPasswordForm() {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Link undangan/reset Supabase membawa token di URL fragment — client
    // browser otomatis meng-exchange-nya jadi sesi (detectSessionInUrl).
    supabase.auth.getSession().then(({ data }) => {
      setSessionState(data.session ? "ready" : "invalid");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setSessionState("ready");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (updateError) {
      setError("Gagal menyimpan kata sandi. Coba lagi.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/admin/login"), 1500);
  }

  if (sessionState === "checking") {
    return <p className="text-sm text-text-muted">Memeriksa tautan…</p>;
  }

  if (sessionState === "invalid") {
    return (
      <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-on-danger-soft">
        Tautan tidak valid atau sudah kedaluwarsa. Minta undangan baru ke landlord/admin platform.
      </p>
    );
  }

  if (success) {
    return (
      <p className="rounded-lg bg-success-soft px-3 py-2 text-sm text-on-success-soft">
        Kata sandi tersimpan. Mengalihkan ke halaman masuk…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">Kata Sandi Baru</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-on-danger-soft">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full"
      >
        {isSubmitting ? "Menyimpan…" : "Simpan Kata Sandi"}
      </Button>
    </form>
  );
}
