import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Aparatur } from "@/lib/data/aparatur";
import { AparaturCard } from "./AparaturCard";

function levelOf(jabatan: string): 1 | 2 | 3 {
  const value = jabatan.toLowerCase();
  if (value === "kepala desa") return 1;
  if (value === "sekretaris desa") return 2;
  return 3;
}

export function StrukturOrganisasi({ data }: { data: Aparatur[] }) {
  if (data.length === 0) {
    return <EmptyState icon={<FileQuestion />} message="Belum ada data tersedia" />;
  }

  const sorted = [...data].sort((a, b) => a.urutan - b.urutan);
  const level1 = sorted.filter((item) => levelOf(item.jabatan) === 1);
  const level2 = sorted.filter((item) => levelOf(item.jabatan) === 2);
  const level3 = sorted.filter((item) => levelOf(item.jabatan) === 3);

  return (
    <div className="flex flex-col items-center gap-8">
      {level1.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6">
          {level1.map((item) => (
            <AparaturCard key={item.id} aparatur={item} />
          ))}
        </div>
      )}
      {level2.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 border-t border-border pt-8">
          {level2.map((item) => (
            <AparaturCard key={item.id} aparatur={item} />
          ))}
        </div>
      )}
      {level3.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 border-t border-border pt-8">
          {level3.map((item) => (
            <AparaturCard key={item.id} aparatur={item} />
          ))}
        </div>
      )}
    </div>
  );
}
