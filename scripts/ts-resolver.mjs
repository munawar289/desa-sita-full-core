/**
 * Resolver hook: mengizinkan import relatif tanpa ekstensi (`./contrast`) yang
 * dipakai di seluruh `src/` untuk jalan di Node ESM, yang menuntut ekstensi
 * eksplisit.
 *
 * Ini yang bikin skrip di `scripts/` bisa meng-import engine tema APA ADANYA —
 * tanpa langkah build, tanpa runner TypeScript tambahan. Type stripping-nya
 * sendiri sudah bawaan Node ≥ 22.6.
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch {
      // Bukan berkas .ts — jatuh ke resolusi normal di bawah.
    }
  }
  return nextResolve(specifier, context);
}
