import { LogOut, Menu } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import type { CurrentProfile } from "@/lib/auth/current-profile";

export function AdminTopbar({
  profile,
  onMenuClick,
}: {
  profile: CurrentProfile;
  onMenuClick: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka menu"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-border-strong hover:text-text md:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{profile.nama_lengkap}</p>
          <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
            {profile.role}
          </p>
        </div>
      </div>

      <form action={signOutAction}>
        {/* Tombol netral, bukan berwarna danger: `--color-danger` hanya dijamin
            3:1 terhadap surface (batas komponen), tidak cukup untuk teks. Sama
            seperti tombol "Coba Lagi" di ErrorState. */}
        <button
          type="submit"
          aria-label="Keluar"
          className="flex size-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border text-sm font-medium text-text-muted transition-all duration-200 hover:border-border-strong hover:text-text sm:h-auto sm:w-auto sm:px-3 sm:py-1.5"
        >
          <LogOut className="size-4" aria-hidden />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </form>
    </header>
  );
}
