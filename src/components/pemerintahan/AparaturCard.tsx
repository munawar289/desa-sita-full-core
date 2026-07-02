import type { Aparatur } from "@/lib/data/aparatur";

function inisial(nama: string | null) {
  if (!nama) return "?";
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function AparaturCard({ aparatur }: { aparatur: Aparatur }) {
  return (
    <div className="flex w-48 flex-col items-center rounded-xl border border-kakao-200 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex size-14 items-center justify-center rounded-full bg-kopi-100 font-heading text-lg font-bold text-kopi-600">
        {inisial(aparatur.nama)}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-kopi-600">
        {aparatur.jabatan}
      </p>
      <p className="mt-1 font-heading text-sm font-semibold text-espresso-950">
        {aparatur.nama ?? "—"}
      </p>
      {aparatur.pendidikan && (
        <p className="mt-1 text-xs text-espresso-800/60">{aparatur.pendidikan}</p>
      )}
    </div>
  );
}
