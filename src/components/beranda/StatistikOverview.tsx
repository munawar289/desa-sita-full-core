import Link from "next/link";
import { ArrowRight, GraduationCap, Landmark, CalendarRange, ClipboardCheck } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { PRODESKEL_CHECKLIST } from "@/lib/data/prodeskel-checklist";
import { getStatistik } from "@/lib/queries/statistik";
import { getStatistikRt } from "@/lib/queries/statistik-rt";
import { getStatistikSektorUsaha } from "@/lib/queries/statistik-sektor-usaha";
import { getStatistikKelompokUmur } from "@/lib/queries/statistik-kelompok-umur";
import { getStatistikPendidikan } from "@/lib/queries/statistik-pendidikan";
import { getDesaProfil } from "@/lib/queries/desa-profil";

function terbanyak<T extends { jumlah: number }>(items: T[]): T | null {
  return items.reduce<T | null>((max, item) => (!max || item.jumlah > max.jumlah ? item : max), null);
}

export async function StatistikOverview() {
  const [profil, statistik, statistikRt, statistikSektorUsaha, statistikKelompokUmur, statistikPendidikan] =
    await Promise.all([
      getDesaProfil(),
      getStatistik(),
      getStatistikRt(),
      getStatistikSektorUsaha(),
      getStatistikKelompokUmur(),
      getStatistikPendidikan(),
    ]);

  const pendidikanTerbanyak = terbanyak(statistikPendidikan);
  const umurTerbanyak = terbanyak(statistikKelompokUmur);
  const mataPencaharian = statistik
    .filter((item) => item.category === "mata_pencaharian")
    .map((item) => ({ label: item.label, jumlah: Number(item.value) }));
  const mataPencaharianTerbanyak = terbanyak(mataPencaharian);

  const prodeskelResults = PRODESKEL_CHECKLIST.map((item) =>
    item.cek({ statistik, statistikRt, statistikSektorUsaha, statistikKelompokUmur, statistikPendidikan }),
  );
  const jumlahTersedia = prodeskelResults.filter(Boolean).length;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeader eyebrow="Data Desa" title={`Sekilas Statistik Desa ${profil.nama_desa}`} />

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          icon={GraduationCap}
          label="Pendidikan Terbanyak"
          value={pendidikanTerbanyak?.tingkat ?? "—"}
        />
        <StatCard
          icon={Landmark}
          label="Mata Pencaharian Utama"
          value={mataPencaharianTerbanyak?.label ?? "—"}
        />
        <StatCard
          icon={CalendarRange}
          label="Kelompok Umur Terbanyak"
          value={umurTerbanyak?.kelompok_usia ?? "—"}
        />
        <StatCard
          icon={ClipboardCheck}
          label="Indeks Data Prodeskel"
          value={`${jumlahTersedia} / ${prodeskelResults.length}`}
        />
      </div>

      <div className="mt-8 text-center">
        <Button
          asChild
          variant="outline"
          className="rounded-lg border-kopi-600 text-kopi-600 hover:bg-kopi-100 hover:text-kopi-600"
        >
          <Link href="/data-desa">
            Lihat Data Desa Lengkap
            <ArrowRight className="ml-1 inline size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
