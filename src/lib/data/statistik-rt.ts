// Struktur gabungan tabel `statistik_rt` + `wilayah_rt` — PRD statistik-lanjutan §3.2
export type StatistikRt = {
  id: string;
  category: string;
  value: number | null;
  detail: Record<string, number> | null;
  updated_at: string;
  rt_nomor: string;
  rt_nama: string;
  rt_urutan: number;
};

const PENDUDUK: [string, number][] = [
  ["001", 157], ["002", 154], ["003", 220], ["004", 159],
  ["005", 195], ["006", 243], ["007", 212], ["008", 168],
  ["009", 176], ["010", 215], ["011", 147], ["012", 287],
  ["013", 159], ["014", 334], ["015", 191], ["016", 242],
];

const KELUARGA: [string, number][] = [
  ["001", 44], ["002", 44], ["003", 61], ["004", 41],
  ["005", 51], ["006", 65], ["007", 55], ["008", 46],
  ["009", 50], ["010", 59], ["011", 42], ["012", 72],
  ["013", 42], ["014", 86], ["015", 51], ["016", 64],
];

// Cakupan air bersih: RT 001-013 via PDAM, RT 014-016 via Air Ledeng —
// lihat catatan asumsi di seed_lanjutan_kelompok2.sql.
const AIR_BERSIH: [string, Record<string, number>][] = [
  ["001", { pdam: 44, ledeng: 0 }], ["002", { pdam: 44, ledeng: 0 }],
  ["003", { pdam: 61, ledeng: 0 }], ["004", { pdam: 41, ledeng: 0 }],
  ["005", { pdam: 51, ledeng: 0 }], ["006", { pdam: 65, ledeng: 0 }],
  ["007", { pdam: 55, ledeng: 0 }], ["008", { pdam: 46, ledeng: 0 }],
  ["009", { pdam: 50, ledeng: 0 }], ["010", { pdam: 59, ledeng: 0 }],
  ["011", { pdam: 42, ledeng: 0 }], ["012", { pdam: 72, ledeng: 0 }],
  ["013", { pdam: 42, ledeng: 0 }], ["014", { pdam: 0, ledeng: 86 }],
  ["015", { pdam: 0, ledeng: 51 }], ["016", { pdam: 0, ledeng: 64 }],
];

const RT_NOMOR = PENDUDUK.map(([nomor]) => nomor);

function buildRows(
  category: string,
  values: Map<string, number | null>,
  details?: Map<string, Record<string, number>>,
): StatistikRt[] {
  return RT_NOMOR.map((nomor, index) => ({
    id: `statrt-${category}-${nomor}`,
    category,
    value: values.get(nomor) ?? null,
    detail: details?.get(nomor) ?? null,
    updated_at: "2026-06-01",
    rt_nomor: nomor,
    rt_nama: `RT ${nomor}`,
    rt_urutan: index + 1,
  }));
}

export const statistikRtMock: StatistikRt[] = [
  ...buildRows("penduduk", new Map(PENDUDUK)),
  ...buildRows("keluarga", new Map(KELUARGA)),
  ...buildRows("pengangguran", new Map()),
  ...buildRows("aset_tanaman", new Map()),
  ...buildRows("air_bersih", new Map(), new Map(AIR_BERSIH)),
];
