import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BadgeKategori } from "@/components/shared/BadgeKategori";
import { cn } from "@/lib/utils";

export type StatTableColumn<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right";
};

export function StatTable<T extends { id: string }>({
  columns,
  rows,
  highlightKey,
}: {
  columns: StatTableColumn<T>[];
  rows: T[];
  /** Numeric field used to badge the row with the highest value. */
  highlightKey?: keyof T;
}) {
  const maxRowId =
    highlightKey &&
    rows.reduce<{ id: string; value: number } | null>((max, row) => {
      const raw = row[highlightKey];
      const value = typeof raw === "number" ? raw : Number(raw);
      if (Number.isNaN(value)) return max;
      if (!max || value > max.value) return { id: row.id, value };
      return max;
    }, null)?.id;

  return (
    <Table className="overflow-hidden rounded-xl border border-kakao-200">
      <TableHeader className="bg-kakao-100">
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead
              key={String(column.key)}
              className={cn(
                "font-mono text-xs uppercase tracking-wider text-sawah-700",
                column.align === "right" && "text-right",
              )}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow
            key={row.id}
            className={cn(index % 2 === 1 && "bg-kakao-100/60", "hover:bg-kopi-100/50")}
          >
            {columns.map((column) => (
              <TableCell
                key={String(column.key)}
                className={cn(
                  "text-espresso-800",
                  column.align === "right" && "text-right font-mono text-espresso-950",
                )}
              >
                {String(row[column.key] ?? "—")}
                {highlightKey === column.key && row.id === maxRowId && (
                  <BadgeKategori label="Tertinggi" tone="sekunder" className="ml-2" />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
