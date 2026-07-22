import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-danger-soft bg-surface px-6 py-12 text-center">
      {/* Galat dibawa oleh ikon + kalimat, bukan warna sendirian (WCAG 1.4.1).
          Tombolnya sengaja varian netral DESIGN.md §6.1: "Coba Lagi" bukan aksi
          berbahaya, dan teks berwarna danger tidak dijamin 4.5:1 di atas surface. */}
      <AlertTriangle className="size-10 text-danger" aria-hidden />
      <p className="text-sm text-text-muted">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="border-border-strong bg-surface text-link hover:bg-primary-soft hover:text-on-primary-soft"
        >
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
