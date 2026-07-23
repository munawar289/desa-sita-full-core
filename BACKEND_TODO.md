# BACKEND_TODO

Kontrak data untuk tim backend. Setiap entri lahir dari komponen UI yang butuh
data yang belum disediakan backend, sehingga sementara memakai MOCK DATA di
`src/mock/`. Saat backend menyediakan field aslinya, ganti mock dengan query.

---

## 1. Foto latar Hero beranda

- **Fitur:** Hero halaman beranda menampilkan foto desa sebagai latar.
- **Dipakai di:** `src/components/beranda/HeroSection.tsx`
- **Mock:** `src/mock/hero.ts` (`heroMedia`)
- **Kebutuhan data:** kolom gambar hero di `desa_profil`, mis.

  ```jsonc
  {
    "hero_gambar_url": "https://.../hero.jpg", // string | null
    "hero_gambar_alt": "Deskripsi foto dalam Bahasa Indonesia" // string | null
  }
  ```

  Jika `hero_gambar_url` null, UI jatuh ke panel gelap bertoken (tanpa foto).

## 2. Foto kartu potensi desa

- **Fitur:** Tiap kartu potensi di beranda menampilkan foto di atas kartu.
- **Dipakai di:** `src/components/beranda/PotensSection.tsx`
- **Mock:** `src/mock/potensi-media.ts` (`potensiMediaByIcon`)
- **Kebutuhan data:** kolom gambar per baris `potensi_desa`, mis.

  ```jsonc
  {
    "gambar_url": "https://.../potensi.jpg", // string | null
    "gambar_alt": "Deskripsi foto dalam Bahasa Indonesia" // string | null
  }
  ```

  Jika `gambar_url` null, kartu memakai placeholder ikon bertoken
  (`--color-surface-alt` + ikon Lucide), sesuai DESIGN.md §5.2.
