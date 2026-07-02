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
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-tanah-100 bg-white px-6 py-12 text-center">
      <AlertTriangle className="size-10 text-tanah-500" />
      <p className="text-sm text-espresso-800/70">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="border-tanah-500 text-tanah-500 hover:bg-tanah-100 hover:text-tanah-500"
        >
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
