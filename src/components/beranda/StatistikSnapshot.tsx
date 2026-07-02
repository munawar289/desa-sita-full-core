import { Users, Home, Map, Building2 } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { getStatistik } from "@/lib/queries/statistik";

const snapshotKeys = [
  { key: "total_penduduk", label: "Total Penduduk", icon: Users },
  { key: "jumlah_kk", label: "Jumlah KK", icon: Home },
  { key: "luas_wilayah", label: "Luas Wilayah", icon: Map },
  { key: "jumlah_dusun", label: "Jumlah Dusun", icon: Building2 },
];

export async function StatistikSnapshot() {
  const statistik = await getStatistik();

  return (
    <section
      id="statistik-snapshot"
      className="relative z-10 mx-auto -mt-24 max-w-6xl scroll-mt-20 px-4 pb-4 sm:px-6"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {snapshotKeys.map(({ key, label, icon }) => {
          const stat = statistik.find(
            (item) => item.category === "kependudukan" && item.key === key,
          );
          return (
            <StatCard
              key={key}
              label={stat?.label ?? label}
              value={stat?.value ?? "—"}
              icon={icon}
            />
          );
        })}
      </div>
    </section>
  );
}
