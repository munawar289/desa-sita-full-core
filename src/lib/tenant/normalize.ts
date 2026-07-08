export function normalizeHost(rawHost: string): string {
  return rawHost
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
}
