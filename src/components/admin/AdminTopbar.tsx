import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import type { CurrentProfile } from "@/lib/auth/current-profile";

export function AdminTopbar({ profile }: { profile: CurrentProfile }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-kakao-200 bg-white px-4 sm:px-6">
      <div>
        <p className="text-sm font-semibold text-espresso-950">{profile.nama_lengkap}</p>
        <p className="font-mono text-xs uppercase tracking-wider text-sawah-700">
          {profile.role}
        </p>
      </div>

      <form action={signOutAction}>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-full border border-kakao-200 px-3 py-1.5 text-sm font-medium text-espresso-800 transition-all duration-200 hover:border-tanah-500 hover:text-tanah-500"
        >
          <LogOut className="size-4" />
          Keluar
        </button>
      </form>
    </header>
  );
}
