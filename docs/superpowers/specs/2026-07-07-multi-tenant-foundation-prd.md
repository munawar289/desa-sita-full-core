# PRD — Fondasi Multi-Tenant SaaS (Phase 3: Infrastruktur)

**Tanggal:** 2026-07-07
**Status:** Draft untuk direview
**Scope:** Fondasi infrastruktur multi-tenant murni — tabel `tenants` + `memberships` baru, Tenant Resolver, perluasan middleware. **Tidak termasuk** perubahan `tenant_id` ke tabel bisnis existing, tidak ada perubahan UI admin/publik. Itu masuk Phase 4 (lihat §12).

---

## 1. Context

`nextjs-desa-sita` saat ini adalah website profil desa single-tenant yang **sudah berjalan di produksi** (Next.js 15 App Router, Supabase). Tujuan besar: mengubah aplikasi ini jadi platform SaaS di mana banyak desa memakai codebase & database yang sama, dengan data terisolasi penuh per desa (tenant).

Dokumen ini adalah **Phase 3** dari rencana migrasi 5-fase:
- Phase 1 (selesai) — analisis codebase, tanpa perubahan.
- Phase 2 (selesai) — desain arsitektur (dokumen ini).
- **Phase 3 (target PRD ini)** — bangun fondasi infrastruktur murni: tabel tenant baru, tenant resolver, middleware. **Tidak ada tabel bisnis existing yang diubah, tidak ada halaman admin/public yang berubah perilaku.**
- Phase 4 (belum) — sambungkan tabel bisnis existing (`desa_profil`, `statistik`, dst) ke `tenant_id`, satu modul per satu.
- Phase 5 (belum) — verifikasi seluruh halaman publik tetap identik seperti sebelum migrasi.

**Keputusan yang sudah diambil:**
- Strategi identifikasi tenant: **subdomain** (`desa-a.appdesa.com`), bukan path prefix — supaya struktur folder `src/app/**` tidak perlu dipindah sama sekali. Tetap dibungkus abstraksi resolver agar strategi path-based bisa ditambah nanti tanpa mengubah application logic.
- Model role foundation: **tanpa tabel `roles`/`permissions` terpisah dulu** — role tetap kolom teks (`admin`/`operator`), konsisten dengan pola `profiles.role` yang sudah ada. Ini menghindari premature abstraction untuk solo-developer/budget nyaris nol.

## 2. Tujuan (Goals)

1. Ada tabel `tenants` sebagai sumber kebenaran daftar desa yang terdaftar di platform.
2. Ada tabel `memberships` yang menghubungkan `profiles` (user) ke `tenants` dengan role per-tenant — fondasi supaya satu user bisa (nanti) mengelola lebih dari satu desa.
3. Ada **Tenant Resolver** yang bisa menentukan tenant mana yang sedang diakses dari `Host` header, dan diinjeksikan sebagai context yang bisa dibaca di Server Component/Server Action manapun.
4. Middleware existing (auth admin) tetap berfungsi identik — resolusi tenant ditambahkan sebagai lapisan baru yang tidak mengganggu alur auth yang sudah ada.
5. Situs produksi yang sekarang (single domain) **tidak berubah perilaku sama sekali** setelah Phase 3 di-deploy — karena hanya ada 1 baris tenant (default) dan semua request diarahkan ke tenant itu.

## 3. Non-Goals (eksplisit di luar scope Phase 3)

- **Tidak** menambah kolom `tenant_id` ke tabel bisnis manapun (`desa_profil`, `statistik`, `lembaga`, dst). Itu Phase 4.
- **Tidak** mengubah `is_admin()` / `is_staff()` / `current_user_role()` (RLS helper functions existing) yang masih baca `profiles.role`. Migrasi ke cek berbasis `memberships` adalah Phase 4.
- **Tidak** mengubah UI admin atau halaman publik manapun.
- **Tidak** membuat UI untuk mengelola tenant (create desa baru dari dashboard) — Phase 3 hanya menyiapkan skema & resolver, tenant baru untuk sekarang dibuat manual lewat SQL/seed.
- **Tidak** menyiapkan custom domain per desa secara fungsional (kolom `domain` disiapkan di skema, tapi logic pemakaiannya menyusul).

## 4. Perubahan Database

> Divalidasi ulang oleh review arsitektur kedua (lihat catatan penting di §4.3) — repo ini **tidak** punya tooling migrasi CLI (`supabase/config.toml` tidak ada). Semua migrasi adalah file `.sql` bernomor yang dijalankan manual (kemungkinan lewat Supabase Studio SQL editor) dan bersifat *up-only*. Ini berarti nilai seperti `DEFAULT_TENANT_SLUG` tidak bisa "dibaca dari env" di dalam file SQL — harus di-hardcode literal, persis pola `0005_desa_profil.sql` yang hardcode `'Sita'`.

### 4.1 Migrasi baru: `supabase/migrations/0009_tenants_foundation.sql`

**Tabel `tenants`**

| Kolom | Tipe | Constraint |
|---|---|---|
| `id` | `uuid` | PK, default literal **`00000000-0000-0000-0000-000000000001`** untuk baris seed (bukan `gen_random_uuid()`) — lihat §4.3 kenapa ID ini harus konstan |
| `slug` | `text` | `unique not null`, dipakai sebagai subdomain (`{slug}.appdesa.com`); `check (slug ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$')` (valid sebagai label DNS) + `check (slug = lower(slug))` |
| `domain` | `text` | `unique`, nullable — custom domain per desa; `check (domain is null or domain = lower(domain))`. `unique` pada kolom nullable aman di Postgres (NULL tidak dianggap sama dengan NULL lain) |
| `nama` | `text` | `not null` — nama tampilan desa |
| `status` | `text` | `not null default 'active'`, check in `('active','suspended')` — **kolom ini disiapkan sekarang tapi TANPA efek fungsional apa pun di Phase 3** (mis. halaman maintenance untuk tenant suspended); itu perubahan perilaku halaman publik, ditunda ke Phase 4/5 |
| `created_at` / `updated_at` | `timestamptz` | `default now()`, trigger `set_updated_at` (reuse function existing dari `0003_triggers.sql`) |

**Tabel `memberships`**

| Kolom | Tipe | Constraint |
|---|---|---|
| `id` | `uuid` | PK, `default gen_random_uuid()` |
| `tenant_id` | `uuid` | `references tenants(id) on delete cascade, not null` |
| `profile_id` | `uuid` | `references profiles(id) on delete cascade, not null` |
| `role` | `text` | `not null default 'operator', check (role in ('admin','operator'))` |
| `created_at` / `updated_at` | `timestamptz` | `default now()`, trigger `set_updated_at` |

- `unique (tenant_id, profile_id)` — satu user satu role per tenant.
- **`create index idx_memberships_profile_id on memberships (profile_id);`** — wajib eksplisit; index komposit dari unique constraint di atas tidak efisien untuk query "tenant apa saja milik user ini" (filter `profile_id` saja).
- Duplikasi `role` antara `profiles.role` (existing) dan `memberships.role` (baru) adalah **keputusan sengaja**, bukan gap: selama Phase 3, `profiles.role` tetap satu-satunya sumber kebenaran untuk `is_admin()`/`is_staff()` (tidak disentuh); `memberships.role` adalah struktur paralel yang baru mulai dipakai setelah migrasi RLS di Phase 4. Beri komentar eksplisit soal ini di file migrasi.

**RLS**

- `tenants`: `select` terbuka (`using (true)`) untuk `anon` + `authenticated` — perlu di-resolve dari sisi publik saat render situs desa tanpa login. Konsisten dengan pola existing (`0002_rls.sql` juga pakai `using (true)` untuk data non-sensitif). Konsekuensinya: daftar nama/slug/domain semua tenant bisa dibaca siapa pun yang punya anon key — dicatat sebagai item hardening opsional untuk Phase 4/5 (mis. lewat RPC function alih-alih table-read langsung), **tidak blocking** untuk Phase 3. `insert/update/delete` admin-only lewat helper `is_admin()` existing.
- `memberships`: `select` untuk baris milik diri sendiri (`profile_id = auth.uid()`) atau admin; `insert/update/delete` admin-only.

**Seed & backfill (bagian dari migrasi yang sama)**

1. Insert satu baris `tenants` dengan `id` **literal konstan** `00000000-0000-0000-0000-000000000001`, `slug` di-hardcode (mis. `'sita'`, disamakan manual dengan env `DEFAULT_TENANT_SLUG`), `nama` di-hardcode (mis. `'Desa Sita'`), `domain = null`. **TODO sebelum apply**: sesuaikan literal ini dengan kondisi produksi nyata.
2. Backfill `memberships`: `insert into memberships (tenant_id, profile_id, role) select '00000000-0000-0000-0000-000000000001', id, role from profiles on conflict (tenant_id, profile_id) do nothing;` — 1:1 dengan data existing, memastikan admin yang sudah ada **tidak kehilangan akses apa pun**.

Contoh lengkap SQL migrasi ada di §4.3.

### 4.2 Tabel existing — tidak ada perubahan skema di Phase 3.

### 4.3 Kenapa `id` tenant default harus literal konstan, bukan `gen_random_uuid()`

`src/lib/tenant/constants.ts` (kode aplikasi) akan menyimpan `DEFAULT_TENANT_ID` sebagai string literal yang **harus identik** dengan ID yang di-seed di SQL ini. Ini yang memungkinkan resolver melakukan *fast path* (§5) — mengembalikan objek tenant default lengkap dengan ID yang valid sebagai FK **tanpa query ke Supabase sama sekali** untuk host produksi yang sudah dikenal. Kalau ID dibiarkan random, resolver harus selalu query DB minimal sekali untuk tahu ID-nya, menghilangkan manfaat fast-path.

**Resolusi `domain` vs `slug` — bukan "either/or", tapi "keduanya selalu aktif":** setiap tenant wajib punya `slug` (dipakai untuk `{slug}.appdesa.com`, identitas utama). Kolom `domain` opsional, hanya terisi kalau tenant sudah pasang custom domain — dan itu **tidak menggantikan** subdomain, keduanya tetap resolve ke tenant yang sama (pola umum SaaS: subdomain platform selalu jalan, custom domain adalah tambahan). Resolver harus cek `domain` dulu (exact match, lebih spesifik), baru fallback ke ekstraksi subdomain dari `slug`.

Contoh lengkap `0009_tenants_foundation.sql`:

```sql
-- Fondasi multi-tenant (Phase 3 — infrastruktur murni). Tabel bisnis existing
-- TIDAK disentuh. Tujuan: tabel tenants + memberships, RLS, dan satu tenant
-- default supaya admin & situs existing tidak kehilangan akses/berubah perilaku.

create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  domain text unique,
  nama text not null,
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenants_slug_format check (slug ~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$'),
  constraint tenants_slug_lowercase check (slug = lower(slug)),
  constraint tenants_domain_lowercase check (domain is null or domain = lower(domain))
);

create trigger set_updated_at_tenants
  before update on tenants
  for each row execute function set_updated_at();

create table memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  -- Duplikasi sengaja dengan profiles.role selama masa transisi — lihat §4.1.
  role text not null check (role in ('admin', 'operator')) default 'operator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_id)
);

create index idx_memberships_profile_id on memberships (profile_id);

create trigger set_updated_at_memberships
  before update on memberships
  for each row execute function set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────
alter table tenants enable row level security;

create policy "tenants_public_read"
  on tenants for select
  using (true); -- perlu di-resolve dari anon client (publik & middleware)

create policy "tenants_admin_write"
  on tenants for all
  using (is_admin())
  with check (is_admin());

alter table memberships enable row level security;

create policy "memberships_select_own_or_admin"
  on memberships for select
  using (profile_id = auth.uid() or is_admin());

create policy "memberships_admin_write"
  on memberships for all
  using (is_admin())
  with check (is_admin());

-- ── Seed tenant default + backfill membership ────────────────────────────
-- id KONSTAN (bukan gen_random_uuid()) — harus sama persis dengan
-- src/lib/tenant/constants.ts DEFAULT_TENANT_ID, supaya resolver bisa
-- memakainya lewat fast-path tanpa query DB untuk domain produksi saat ini.
-- TODO sebelum apply: pastikan slug & domain sesuai kondisi produksi nyata.
insert into tenants (id, slug, domain, nama, status) values (
  '00000000-0000-0000-0000-000000000001',
  'sita',   -- samakan dengan env DEFAULT_TENANT_SLUG
  null,     -- isi domain custom produksi di sini kalau sudah ada
  'Desa Sita',
  'active'
);

insert into memberships (tenant_id, profile_id, role)
select '00000000-0000-0000-0000-000000000001', id, role
from profiles
on conflict (tenant_id, profile_id) do nothing;
```

**Wajib dalam PR yang sama**: tambahkan tipe `tenants`/`memberships` ke `src/lib/supabase/database.types.ts` (file ini ditulis manual, tidak ada `supabase gen types` di `package.json`) — kalau lupa, `supabase.from("tenants")` di resolver tidak type-check.

## 5. Perubahan Aplikasi (kode)

### 5.1 File baru — `src/lib/tenant/`

```
src/lib/tenant/
├── types.ts                   # Tenant, TenantResolution, TenantResolverStrategy
├── env.ts                     # baca semua env terkait tenant (pola sama seperti supabase/config.ts)
├── constants.ts                # DEFAULT_TENANT_ID (uuid konstan, match §4.3)
├── normalize.ts                # normalizeHost(): lowercase, strip port, strip trailing dot
├── resolve-tenant.ts           # resolveTenantForHost(host) — entry point dipanggil middleware
├── current-tenant.ts           # getCurrentTenant() — dibaca Server Component/Action via next/headers
└── strategies/
    └── subdomain-strategy.ts   # SubdomainTenantResolver implements TenantResolverStrategy
    # path-strategy.ts BELUM dibuat sekarang (YAGNI) — interface sudah
    # mengantisipasi (parameter `pathname` disertakan sejak awal) supaya bisa
    # ditambah nanti tanpa breaking change.
```

**Poin desain paling penting — hindari DB roundtrip pada domain produksi yang sudah ada.** Karena situs ini sudah production, memaksa SETIAP request (termasuk semua halaman publik yang tadinya statis/ISR) melakukan query Supabase di Edge Middleware adalah risiko besar (latensi + kuota + kegagalan = 500 di seluruh situs). Solusinya: `resolveTenantForHost()` punya **fast path** berbasis env, tanpa DB, untuk host yang sudah dikenal sebagai domain produksi saat ini:

```ts
// src/lib/tenant/resolve-tenant.ts
export async function resolveTenantForHost(rawHost: string): Promise<TenantResolution> {
  const host = normalizeHost(rawHost);

  if (!isSupabaseConfigured() || DEFAULT_TENANT_HOSTS.includes(host)) {
    return { tenant: getDefaultTenantFastPath(), source: "default-fast-path" };
  }

  try {
    const strategy = getTenantResolverStrategy(); // baca env TENANT_STRATEGY
    const result = await strategy.resolve({ host, pathname: "" });
    if (result.tenant) return result;
  } catch (error) {
    console.error("[tenant] Gagal resolve tenant, fallback ke default.", error);
  }

  return { tenant: getDefaultTenantFastPath(), source: "unresolved" };
}
```

`getDefaultTenantFastPath()` mengembalikan objek `Tenant` dengan **ID nyata** (`DEFAULT_TENANT_ID` konstan, sama persis dengan yang di-seed di migrasi SQL §4.3) — bukan stub palsu — supaya header `x-tenant-id` yang diteruskan ke Server Component tetap valid sebagai FK begitu Phase 4 mulai memakainya, tanpa pernah menyentuh DB untuk domain produksi yang sudah dikenal.

`env.ts`:
```ts
export const TENANT_STRATEGY = process.env.TENANT_STRATEGY ?? "subdomain";
export const TENANT_BASE_DOMAIN = process.env.TENANT_BASE_DOMAIN ?? ""; // "appdesa.com"
export const DEFAULT_TENANT_SLUG = process.env.DEFAULT_TENANT_SLUG ?? "sita";
export const DEFAULT_TENANT_HOSTS = (process.env.DEFAULT_TENANT_HOSTS ?? "")
  .split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
// WAJIB berisi semua host produksi existing (custom domain + *.vercel.app)
// supaya tidak ada satupun request produksi hari ini yang lewat jalur DB-lookup.
```

- `strategies/subdomain-strategy.ts` — cek `domain` dulu (exact match ke kolom `tenants.domain`, lebih spesifik), baru fallback ke ekstraksi subdomain dari `host` dicocokkan ke `tenants.slug` (lihat §4.3 soal kenapa keduanya harus dicek, bukan either/or).
- `strategies/path-strategy.ts` — **belum dibuat** (YAGNI), interface `TenantResolverStrategy` sudah didesain agar bisa ditambah nanti tanpa breaking change.
- `current-tenant.ts` — `getCurrentTenant()` dibungkus React `cache()` (pola sama seperti `getDesaProfil()` existing), baca header `x-tenant-id`/`x-tenant-slug` via `next/headers()`. **Peringatan yang sudah ditaruh sebagai komentar di kode**: memanggil `headers()` di Server Component memaksa route itu keluar dari static/ISR menjadi full-dynamic — belum dipanggil di mana pun pada Phase 3 (dead code sampai Phase 4 mulai memakainya), tapi Phase 4 harus merencanakan caching data per-tenant-id, bukan hanya mengandalkan static generation.

### 5.2 File dimodifikasi

- **`src/middleware.ts`** — matcher diperluas dari `"/admin/:path*"` ke `["/((?!_next/static|_next/image|favicon\\.ico).*)"]`. Alur baru:

```ts
export async function middleware(request: NextRequest) {
  const { tenant } = await resolveTenantForHost(request.headers.get("host") ?? "");

  const requestHeaders = new Headers(request.headers);
  if (tenant) {
    requestHeaders.set("x-tenant-id", tenant.id);
    requestHeaders.set("x-tenant-slug", tenant.slug);
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateSession(request, requestHeaders); // signature diperluas, lihat di bawah
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

  Detail teknis yang sering salah diimplementasikan: header untuk dibaca `next/headers` di Server Component **harus di-set di request** yang diteruskan (`NextResponse.next({ request: { headers } })`), bukan hanya di response — `response.headers.set(...)` cuma sampai ke browser, tidak sampai ke render server.

  Logika redirect auth (`isLoginRoute`, dst.) di `updateSession()` **tidak berubah sama sekali** — tetap 100% di-scope ke `pathname.startsWith("/admin")` yang sekarang ditentukan secara eksplisit oleh `src/middleware.ts`, bukan oleh matcher tunggal. Ini yang memastikan broadening matcher tidak pernah membuat halaman publik ikut kena redirect ke `/admin/login`.

- **`src/lib/supabase/middleware.ts`** — perubahan minimal: `updateSession()` menerima parameter tambahan `requestHeaders: Headers`, dipakai di kedua tempat yang tadinya `NextResponse.next({ request })` supaya header tenant tetap terbawa setelah refresh cookie session. Logika inti (cek sesi, redirect) tidak berubah.
- **`.env.example`** — tambah `TENANT_STRATEGY=subdomain`, `TENANT_BASE_DOMAIN=appdesa.com`, `DEFAULT_TENANT_SLUG=sita`, `DEFAULT_TENANT_HOSTS=` (comma-separated, isi semua host produksi existing termasuk `*.vercel.app` preview), dan flag dev-only `TENANT_DEV_FORCE_SLUG`, `TENANT_DEBUG_HEADERS` (lihat §7).

### 5.3 File yang **tidak** disentuh

`src/lib/supabase/server.ts`, `public.ts`, `config.ts`, seluruh `src/lib/actions/*`, `src/lib/queries/*` (selain file tenant baru), semua halaman di `src/app/**`, `src/lib/auth/current-profile.ts`, RLS helper functions existing.

## 6. Alur Request (Tenant Resolution Flow)

```
Request masuk → src/middleware.ts
  → resolveTenantForHost(host)
      → fast path (tanpa DB) jika host ada di DEFAULT_TENANT_HOSTS
        atau Supabase belum dikonfigurasi
      → kalau tidak: strategy.resolve({host, pathname}) — cek domain dulu,
        baru fallback ekstraksi subdomain dari slug; try/catch, gagal → fast path
  → set header x-tenant-id & x-tenant-slug pada request yang diteruskan
  → jika pathname.startsWith("/admin"): jalankan updateSession(request, requestHeaders)
  → else: NextResponse.next({ request: { headers: requestHeaders } })

Di Server Component / Layout / Action (Phase 4+, belum dipakai di Phase 3):
  → getCurrentTenant() baca x-tenant-id/x-tenant-slug dari next/headers
  → query tabel bisnis akan difilter tenant_id = tenant.id
```

## 7. Strategi Testing Lokal (tanpa wildcard DNS asli)

Dua opsi, pakai keduanya:

- **Opsi cepat (harian):** env dev-only `TENANT_DEV_FORCE_SLUG` (hanya aktif kalau `NODE_ENV !== "production"`), dicek paling awal di `resolveTenantForHost()` sebelum fast-path/DB — simulasikan tenant tertentu tanpa DNS/hosts sama sekali, ganti-ganti tenant tinggal ubah `.env.local`.
- **Opsi realistis (sebelum ship):** pakai `lvh.me` — domain publik yang sudah wildcard resolve ke `127.0.0.1` tanpa perlu edit `/etc/hosts` atau sudo. Set `TENANT_BASE_DOMAIN=lvh.me`, akses `http://sita.lvh.me:3000` → resolver ekstrak subdomain `sita` → match `tenants.slug`.
- Tambahkan flag opsional `TENANT_DEBUG_HEADERS=true` (dev/preview saja) yang meng-echo `x-tenant-slug` juga ke response header, supaya bisa diverifikasi lewat `curl -I` tanpa perlu DevTools.

Test 3 skenario: (1) akses `http://localhost:3000` polos (harus tetap resolve ke default via `DEFAULT_TENANT_HOSTS=localhost:3000`) → perilaku identik situs sekarang; (2) akses `http://sita.lvh.me:3000` dengan tenant `sita` sudah di-seed → resolve ke tenant tsb; (3) akses subdomain yang tidak terdaftar → tidak crash, fallback ke default tenant (bukan 500).

## 8. Urutan Langkah Migrasi (aman, incremental — tiap langkah = commit/PR terpisah, supaya rollback presisi)

1. Apply migrasi `0009_tenants_foundation.sql` ke Supabase (additive murni, tidak mengunci/mengubah tabel existing manapun — read-only-safe untuk app yang sedang jalan). Verifikasi manual: login admin masih jalan, `is_admin()`/`profiles` tidak berubah. Tambahkan tipe `tenants`/`memberships` ke `database.types.ts` dalam PR yang sama.
2. Tambah `src/lib/tenant/**` — pure addition, tidak dipanggil siapa pun, zero risiko runtime, bisa deploy kapan saja. Pastikan `next build` lokal lolos sebelum push.
3. Ubah `src/middleware.ts` + `src/lib/supabase/middleware.ts` (broaden matcher, panggil resolver, teruskan header) — **satu-satunya langkah yang menyentuh jalur eksekusi production yang sudah jalan**. Deploy ke Vercel Preview dulu (push branch non-main), uji manual: halaman publik render normal, `/admin` redirect-to-login tetap sama, cek header via `curl -sI` (dengan `TENANT_DEBUG_HEADERS=true`) bahwa `x-tenant-id`/`x-tenant-slug` muncul benar — baru merge ke main.
4. Set env vars aktual di Vercel (`TENANT_STRATEGY`, `TENANT_BASE_DOMAIN`, `DEFAULT_TENANT_SLUG`, `DEFAULT_TENANT_HOSTS` — **wajib berisi semua host produksi existing** sebelum langkah 3 di-merge ke main).

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Middleware matcher diperluas ke semua route → salah resolve bisa bikin situs publik 404/redirect loop | `DEFAULT_TENANT_HOSTS` wajib mendaftar semua host produksi saat ini → selalu lewat fast-path, tidak pernah menyentuh DB; test manual semua route publik utama sebelum & sesudah deploy (§11) |
| Edge Middleware sekarang jalan di setiap request publik (dulu 0 request untuk non-admin) | Fast-path tidak menyentuh DB untuk host produksi dikenal — tambahan kerjanya cuma parsing string, bukan I/O; pantau latensi/kuota Vercel Free pasca-deploy |
| Kegagalan Supabase saat DB-lookup (host belum dikenal) melempar exception → 500 di **seluruh situs** karena middleware sekarang menyentuh semua path | Wajib try/catch di `resolveTenantForHost()`, fallback ke default tenant (pola sama dengan `withSupabaseFallback` existing). Test eksplisit: matikan/rusak env Supabase lokal, pastikan situs tetap render |
| `updateSession()` logic (auth admin) tidak sengaja ikut berubah scope-nya | Resolusi tenant untuk path non-admin tidak boleh menyentuh cabang redirect apa pun; `pathname.startsWith("/admin")` tetap dicek eksplisit di `src/middleware.ts`, bukan mengandalkan matcher tunggal |
| Migrasi backfill `memberships` salah mapping role | Backfill pakai `INSERT ... SELECT` langsung dari `profiles.role`, bukan hardcode — 1:1 dengan data existing, mudah direview manual karena jumlah admin kemungkinan sangat sedikit |
| RLS `tenants` public-select membocorkan daftar tenant | Kolom di tabel ini memang didesain non-sensitif (slug/nama/status/domain), konsisten dengan pola existing — dicatat sebagai item hardening opsional Phase 4/5 (RPC function), tidak blocking sekarang |
| Env var lupa di-set di Vercel production | `resolveTenantForHost` punya fallback hardcoded aman (fast-path default tenant) kalau env kosong, bukan throw — konsisten dengan pola `isSupabaseConfigured()` existing yang graceful |
| (Forward-looking, dicatat untuk Phase 4, bukan risiko Phase 3) `getCurrentTenant()` memanggil `headers()` → route publik yang memakainya keluar dari static/ISR jadi full-dynamic | Sudah ditandai sebagai komentar peringatan di `current-tenant.ts`; Phase 4 harus rencanakan cache data per-tenant-id, bukan andalkan static generation |

## 10. Rollback Strategy

- **Migrasi SQL**: karena repo tidak punya konvensi down-migration, simpan snippet ini di deskripsi PR (bukan file baru): `drop table memberships; drop table tenants;` (urutan karena FK) — aman karena additive-only, tidak ada tabel existing yang berubah skema, dan tidak ada kode lain yang mereferensikan tabel ini sampai langkah 3 di §8 selesai.
- **File `src/lib/tenant/**` baru**: risiko nyaris nol (dead code sampai diwire ke middleware) — menghapus foldernya (kalau perlu) tidak berdampak ke fitur lain.
- **Middleware**: karena ini commit terpisah dari migrasi & file lib baru, `git revert` pada commit ini saja sudah cukup memulihkan behavior lama tanpa menyentuh DB atau file tenant yang sudah ada.

## 11. Testing Checklist

- [ ] `npm run build` sukses tanpa error setelah semua perubahan.
- [ ] `database.types.ts` sudah memuat tipe `tenants`/`memberships` sebelum kode resolver memanggil `supabase.from("tenants")`.
- [ ] Akses domain produksi existing (harus terdaftar di `DEFAULT_TENANT_HOSTS`) — semua halaman publik (`/`, `/profil-desa`, `/data-desa/**`, `/layanan`, dst) render identik seperti sebelum perubahan (visual & data), dan lewat fast-path (tidak ada query DB tambahan — cek log/latensi).
- [ ] Login admin (`/admin/login`) & akses `/admin/(protected)/**` tetap jalan normal, redirect behavior tidak berubah.
- [ ] Admin yang sudah ada sebelumnya (di tabel `profiles`) punya baris `memberships` yang benar setelah migrasi (`select * from memberships`).
- [ ] Akses `http://sita.lvh.me:3000` (atau setara, lihat §7) dengan `TENANT_BASE_DOMAIN` di-set ke `lvh.me` → tenant ter-resolve dengan benar via `subdomain-strategy`, header `x-tenant-id`/`x-tenant-slug` (cek via `TENANT_DEBUG_HEADERS=true` + `curl -I`) sesuai baris `tenants` yang di-seed.
- [ ] Akses subdomain yang tidak terdaftar di `tenants` → tidak crash 500, fallback terkontrol ke default tenant.
- [ ] Matikan/rusak env Supabase secara lokal → situs tetap render (fallback ke default tenant via `resolveTenantForHost`, konsisten pola `withSupabaseFallback` existing) — memverifikasi mitigasi risiko baris ke-3 di §9.
- [ ] RLS `tenants` bisa di-`select` oleh anon client (`src/lib/supabase/public.ts`) tapi tidak bisa di-`insert`/`update` tanpa role admin.
- [ ] RLS `memberships`: user biasa hanya bisa `select` baris miliknya sendiri, admin bisa lihat semua.

## 12. Preview Phase 4 (di luar scope PRD ini, hanya konteks)

Setelah Phase 3 stabil di production, Phase 4 akan: menambah `tenant_id` ke `desa_profil` dulu (karena ini sudah secara alami "tenant settings"), lalu satu per satu ke tabel bisnis lain, memindahkan filter `tenant_id` ke setiap query di `src/lib/queries/*.ts`, migrasi RLS helper (`is_admin()`, dst) dari `profiles.role` global ke `memberships`-scoped per tenant, merancang alur undangan admin ke tenant baru (trigger `handle_new_user()` saat ini selalu membuat `profiles` dengan `role='operator'` tanpa tahu tenant mana — known gap, bukan bug Phase 3), serta merencanakan strategi caching data per-tenant-id begitu `getCurrentTenant()` mulai dipakai di halaman publik (lihat peringatan di §5.1 soal route keluar dari static/ISR).

### Critical Files (referensi cepat untuk implementasi)

- `supabase/migrations/0009_tenants_foundation.sql`
- `src/middleware.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/tenant/resolve-tenant.ts`
- `src/lib/supabase/database.types.ts`
