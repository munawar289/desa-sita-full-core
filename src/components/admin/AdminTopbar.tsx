import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import type { CurrentProfile } from "@/lib/auth/current-profile";

export function AdminTopbar({ profile }: { profile: CurrentProfile }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <div>
        <p className="text-sm font-semibold text-text">{profile.nama_lengkap}</p>
        <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
          {profile.role}
        </p>
      </div>

      <form action={signOutAction}>
        {/* Tombol netral, bukan berwarna danger: `--color-danger` hanya dijamin
            3:1 terhadap surface (batas komponen), tidak cukup untuk teks. Sama
            seperti tombol "Coba Lagi" di ErrorState. */}
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-text-muted transition-all duration-200 hover:border-border-strong hover:text-text"
        >
          <LogOut className="size-4" aria-hidden />
          Keluar
        </button>
      </form>
    </header>
  );
}
