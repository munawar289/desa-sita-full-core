# Aturan Project — Refactor UI/UX Website Desa

## Konteks
Aplikasi multitenant untuk website desa di Indonesia. Setiap tenant (desa)
dapat mengatur warna tema sendiri dari panel admin. Sedang berlangsung
refactor UI/UX bertahap per scope.

## Aturan Wajib (berlaku di semua task)

### Batasan Backend
- JANGAN mengubah alur backend: routes, controllers, services, model,
  migration, business logic, dan API contract yang sudah ada tidak boleh
  diubah dalam task UI.
- Jika sebuah komponen UI membutuhkan data yang belum disediakan backend
  (contoh: hero banner, slides, testimoni, statistik desa), gunakan MOCK DATA.
- Semua mock data WAJIB ditempatkan terpusat di direktori `mock/` (atau
  `resources/mock/` menyesuaikan struktur project), BUKAN inline di dalam
  komponen. Satu file per domain, misal `mock/hero.ts`, `mock/slides.ts`.
- Setiap file mock diberi header komentar:
  `// MOCK DATA — menunggu dukungan backend. Lihat BACKEND_TODO.md`
- Setiap kali menambahkan mock data baru, update file `BACKEND_TODO.md`
  di root: catat nama fitur, struktur data yang dibutuhkan (bentuk
  JSON/field), dan di komponen mana data itu dipakai. File ini adalah
  kontrak untuk tim backend nanti.

### Theming Multitenant
- DILARANG hardcode warna di komponen. Semua warna melalui semantic token
  CSS variables (didefinisikan di DESIGN.md bagian Color System).
- Warna tenant diambil dari pengaturan admin dan diturunkan melalui
  color derivation engine — jangan pernah pakai nilai warna tenant mentah
  langsung di elemen.
- Teks di atas warna primary selalu pakai `--color-on-primary`
  (dihitung otomatis dari kontras), jangan asumsikan putih.

### Disiplin Scope
- Kerjakan HANYA scope yang disebut di task. Jangan "sekalian merapikan"
  halaman/komponen lain di luar scope.
- Selalu baca DESIGN.md sebelum mengerjakan task UI apapun.
- Setelah selesai, tulis ringkasan: file yang diubah, komponen baru,
  mock data yang ditambahkan, dan cara memverifikasinya di browser.

### Standar Kualitas
- Mobile-first. Mayoritas pengguna mengakses via HP kelas menengah-bawah
  dengan koneksi lambat: minimalkan ukuran aset, lazy-load gambar,
  hindari library berat untuk kebutuhan kecil.
- Aksesibilitas dasar: kontras teks minimal WCAG AA (4.5:1), ukuran
  tap target minimal 44px, focus state terlihat, alt text pada gambar,
  hormati `prefers-reduced-motion`.
- Semua copy/teks UI dalam Bahasa Indonesia yang jelas dan ramah,
  bukan istilah teknis. Contoh: "Layanan Surat" bukan "Document Service".