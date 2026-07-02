import type { ReactNode } from "react";

export function EmptyState({
  icon,
  message,
}: {
  icon: ReactNode;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-kakao-200 bg-white px-6 py-12 text-center">
      <div className="text-espresso-950/30 [&_svg]:size-10">{icon}</div>
      <p className="text-sm text-espresso-950/40">{message}</p>
    </div>
  );
}
