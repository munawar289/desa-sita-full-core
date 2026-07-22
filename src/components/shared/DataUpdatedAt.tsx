function hariLalu(updatedAt?: string) {
  if (!updatedAt) return "—";
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (days === 0) return "hari ini";
  if (days === 1) return "1 hari lalu";
  return `${days} hari lalu`;
}

export function DataUpdatedAt({ updatedAt }: { updatedAt?: string }) {
  return (
    <p className="text-sm text-text-muted">
      Data terakhir diperbarui: {hariLalu(updatedAt)}
    </p>
  );
}
