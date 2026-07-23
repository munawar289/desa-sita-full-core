# BACKEND_TODO

Kontrak data untuk tim backend. Setiap entri lahir dari komponen UI yang butuh
data yang belum disediakan backend, sehingga sementara memakai MOCK DATA di
`src/mock/`. Saat backend menyediakan field aslinya, ganti mock dengan query.

---

## 1. Foto latar Hero beranda — SELESAI (2026-07-23)

- **Fitur:** Hero halaman beranda menampilkan foto desa sebagai latar.
- **Dipakai di:** `src/components/beranda/HeroSection.tsx`, halaman login admin
  (`src/app/(site)/admin/login/page.tsx`).
- **Kolom `desa_profil`:** `hero_gambar_url` (`text | null`), `hero_gambar_alt`
  (`text | null`) — lihat `supabase/migrations/0020_desa_profil_hero_gambar.sql`.
- **Input admin:** form Identitas Desa (`src/components/admin/DesaProfilForm.tsx`)
  — unggah file (JPG/PNG/WEBP, maks 5MB) ke Supabase Storage bucket `desa-hero`
  (public, path `{tenant_id}/hero-{timestamp}.{ext}`), plus field alt teks wajib
  kalau ada foto. Admin juga bisa menghapus foto lewat tombol "Hapus foto ini".
  RLS bucket: baca publik, tulis hanya `is_tenant_admin(tenant_id)`.
  Mock lama `src/mock/hero.ts` sudah dihapus.
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
