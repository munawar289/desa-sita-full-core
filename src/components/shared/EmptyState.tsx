import type { ReactNode } from "react";

export function EmptyState({
  icon,
  message,
}: {
  icon: ReactNode;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface-alt px-6 py-12 text-center">
      <div className="text-text-muted [&_svg]:size-10">{icon}</div>
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
