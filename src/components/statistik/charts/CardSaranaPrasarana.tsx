import type { SaranaPrasarana } from "@/lib/data/sarana-prasarana";

export function CardSaranaPrasarana({ data }: { data: SaranaPrasarana[] }) {
  const grouped = data
    .sort((a, b) => a.urutan - b.urutan)
    .reduce<Record<string, SaranaPrasarana[]>>((acc, item) => {
      acc[item.kategori] = [...(acc[item.kategori] ?? []), item];
      return acc;
    }, {});

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(grouped).map(([kategori, items]) => (
        <div
          key={kategori}
          className="rounded-xl border border-kakao-200 bg-white p-5 shadow-sm"
        >
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-kopi-600">
            {kategori}
          </h3>
          <ul className="mt-3 space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-espresso-800">{item.nama}</span>
                <span className="font-semibold text-espresso-950">
                  {item.jumlah ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
