# PRD — Landlord / Platform Admin Panel

**Tanggal:** 2026-07-08
**Status:** Draft untuk direview
**Scope:** Panel administrasi platform (di luar & di atas semua tenant) untuk membuat tenant baru, melihat daftar tenant, suspend/reaktivasi, dan mengundang admin pertama ke tenant baru. **Tidak termasuk** manajemen custom domain dari UI, undang anggota tambahan ke tenant existing, manajemen landlord lain dari UI, atau halaman maintenance publik untuk tenant suspended.

---

## 1. Context

Phase 3 (fondasi multi-tenant) dan Phase 4 (tenant scoping Modul 1-4) sudah selesai diimplementasikan dan diverifikasi jalan di production. Saat ini, satu-satunya cara membuat tenant baru adalah `insert` manual lewat Supabase Studio SQL Editor (sesuai desain sengaja di Phase 3 §3 Non-Goals — "tenant baru untuk sekarang dibuat manual lewat SQL/seed").

Saat menguji isolasi multi-tenant secara manual (buat tenant `coba` lewat SQL, coba akses dashboard admin-nya), ditemukan dua hal:

1. **Tidak ada cara sama sekali** bagi siapa pun untuk membuat/melihat/mengelola tenant selain lewat SQL Editor — tidak scalable begitu ada permintaan desa baru yang sering.
2. **Celah keamanan yang belum tercatat**: RLS `tenants_admin_write` dan `memberships_admin_write` (dari `0009_tenants_foundation.sql`) masih memakai `is_admin()` — helper **lama** yang membaca `profiles.role = 'admin'` secara **global**, bukan tenant-scoped. Artinya, **admin desa manapun** yang kebetulan punya `profiles.role = 'admin'` (mis. admin desa Sita) **secara diam-diam sudah bisa** membuat/menghapus/mengubah tenant *desa lain* dan baris `memberships` lintas-tenant lewat client Supabase langsung — bukan cuma lewat SQL Editor. Ini gap yang harus ditutup di PRD ini, bukan sekadar menambah fitur baru.

**Keputusan yang sudah diambil bersama Anda:**
- **Landlord adalah user yang TOTAL terpisah** dari admin tenant manapun — bukan perluasan role admin desa, bukan flag di `profiles`. Tabel baru `platform_admins`, terisolasi penuh dari `memberships`. Seseorang bisa saja kebetulan py akun yang sama (login Supabase Auth yang sama) di kedua sistem, tapi keanggotaan di satu tabel **sama sekali tidak mengimplikasikan** apa pun di tabel lainnya.
- **Lokasi akses**: path khusus `/platform` (bukan subdomain terpisah), bisa diakses dari host manapun, **sama sekali tidak terikat resolusi tenant** (beda dari `/admin` yang tenant-scoped via `x-tenant-id`).
- **Cakupan MVP**: CRUD tenant (create/list/suspend) + undang admin pertama ke tenant baru — menutup *known gap* yang sudah dicatat di Phase 4 PRD §12 ("trigger `handle_new_user()` saat ini selalu membuat `profiles` dengan `role='operator'` tanpa tahu tenant mana"). Custom domain & undang anggota tambahan ke tenant existing tetap manual SQL, di luar scope.

## 2. Tujuan (Goals)

1. Ada tabel `platform_admins` sebagai daftar eksplisit siapa saja yang punya akses platform-level, terisolasi total dari `memberships`/tenant manapun.
2. RLS `tenants`/`memberships` write **tidak lagi** memakai `is_admin()` global — diganti `is_platform_admin()`, menutup celah admin desa yang tidak sengaja bisa kelola tenant lain.
3. Ada halaman `/platform/login` + `/platform` (dashboard) yang **sepenuhnya terpisah** dari `/admin` — layout, session-check, dan pesan error sendiri.
4. Landlord bisa: (a) lihat daftar semua tenant + statusnya, (b) buat tenant baru (slug + nama), (c) suspend/reaktivasi tenant, (d) undang admin pertama ke tenant baru lewat email — mencakup kasus email belum pernah dipakai di platform sama sekali (invite user baru) maupun sudah pernah (tinggal tambah membership).
5. Middleware **tidak menjalankan resolusi tenant sama sekali** untuk path `/platform` — tidak ada query DB tenant yang sia-sia, dan secara desain memastikan `/platform` tidak pernah bocor ke logic `x-tenant-id`.

## 3. Non-Goals (eksplisit di luar scope)

- **Tidak** ada UI untuk mengelola *landlord lain* (tambah/hapus baris `platform_admins`) — bootstrap & pengelolaan landlord tetap manual SQL, konsisten dengan pola tenant/membership awal di Phase 3.
- **Tidak** ada UI custom domain per tenant — kolom `tenants.domain` tetap diisi manual SQL untuk sekarang.
- **Tidak** ada UI untuk mengundang anggota **tambahan** ke tenant yang **sudah** punya admin (mis. tambah operator kedua) — itu scope fitur "Pengguna" tenant-scoped yang berbeda (placeholder `admin-nav.ts`, `active:false`), bukan bagian panel landlord.
- **Tidak** membangun halaman maintenance publik untuk tenant `status='suspended'` — di PRD ini, suspend **hanya** memblokir akses dashboard admin tenant tersebut (lihat §8), situs publiknya **tetap tampil normal** untuk sekarang. Maintenance page publik dicatat sebagai follow-up terpisah.
- **Tidak** ada billing/pembayaran/paket langganan.
- **Tidak** mengubah `is_staff()`/`is_tenant_staff()`/`is_tenant_admin()` — tetap dipakai apa adanya untuk RLS tabel bisnis tenant-scoped (Phase 4).

## 4. Perubahan Database

### 4.1 Migrasi baru: `supabase/migrations/0014_platform_admins.sql`

```sql
-- Landlord / Platform Admin Panel — tabel platform_admins TOTAL terpisah dari
-- memberships/tenant manapun (keputusan sengaja, bukan flag di profiles).
-- Sekaligus menutup celah keamanan: RLS tenants/memberships masih pakai
-- is_admin() global (profiles.role) sejak 0009 — artinya admin desa manapun
-- yang kebetulan profiles.role='admin' bisa kelola tenant desa LAIN lewat
-- client Supabase langsung. Diganti is_platform_admin() di migrasi ini.

create table platform_admins (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from platform_admins where profile_id = auth.uid()
  );
$$;

alter table platform_admins enable row level security;

-- Landlord cuma bisa lihat baris dirinya sendiri (bukan daftar landlord lain)
-- — cukup untuk cek "apakah saya landlord", tidak perlu lebih untuk MVP.
create policy "platform_admins_select_self"
  on platform_admins for select
  using (profile_id = auth.uid());

-- SENGAJA tidak ada policy insert/update/delete — onboarding landlord baru
-- murni manual lewat SQL Editor (bootstrap), konsisten pola tenant/membership
-- pertama di 0009. TODO sebelum apply: siapkan insert baris landlord pertama
-- di bawah ini dengan profile_id akun Anda sendiri.

-- ── Perbaikan keamanan: ganti is_admin() (global) → is_platform_admin() ────
drop policy "tenants_admin_write" on tenants;
create policy "tenants_admin_write"
  on tenants for all
  using (is_platform_admin())
  with check (is_platform_admin());

drop policy "memberships_admin_write" on memberships;
create policy "memberships_admin_write"
  on memberships for all
  using (is_platform_admin())
  with check (is_platform_admin());

drop policy "memberships_select_own_or_admin" on memberships;
create policy "memberships_select_own_or_admin"
  on memberships for select
  using (profile_id = auth.uid() or is_platform_admin());

-- ── TODO sebelum apply: ganti '<uuid-profile-anda>' dengan id asli dari
-- `select id from profiles where nama_lengkap = '...'` (atau lewat email di
-- auth.users), lalu uncomment baris di bawah untuk bootstrap landlord pertama.
-- insert into platform_admins (profile_id) values ('<uuid-profile-anda>');
```

**Wajib dalam PR yang sama**: tambahkan tipe `platform_admins` ke `database.types.ts` (pola `Row`/`Insert`/`Update` sama seperti tabel lain).

### 4.2 Kenapa `memberships_select_own_or_admin` juga diubah

Ini bukan bagian dari fitur baru, tapi konsekuensi langsung dari perbaikan §4.1: sebelumnya *siapa pun* dengan `profiles.role='admin'` global bisa `select * from memberships` dan melihat baris tenant lain (kebocoran data lintas-tenant). Setelah diganti `is_platform_admin()`, hanya landlord yang bisa lihat semua baris; admin tenant biasa hanya lihat baris miliknya sendiri. **Efek samping yang disengaja**: admin tenant untuk sekarang tidak bisa lihat daftar sesama anggota tenantnya sendiri lewat RLS ini — itu scope fitur "Pengguna" tenant-scoped terpisah (lihat §3 Non-Goals), bukan regresi dari PRD ini.

## 5. Perubahan Aplikasi (kode)

### 5.1 File baru — `src/lib/supabase/service.ts`

```ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_URL } from "./config";

/**
 * Client dengan SERVICE_ROLE_KEY — bypass RLS sepenuhnya, dan satu-satunya
 * cara memanggil Supabase Auth Admin API (mis. inviteUserByEmail). JANGAN
 * PERNAH diimpor dari Client Component atau apa pun yang bisa masuk bundle
 * browser — hanya dipakai dari Server Action `src/lib/actions/platform-*.ts`.
 */
export function createServiceRoleClient(): SupabaseClient<Database> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diset di environment.");
  }
  return createClient<Database>(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

Ini adalah **pemakaian pertama** `SUPABASE_SERVICE_ROLE_KEY` di codebase — variabel ini sudah disiapkan di `.env.example` sejak awal ("Fase 2+") tapi belum pernah dipakai kode manapun.

### 5.2 File baru — `src/lib/auth/current-platform-admin.ts`

```ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentPlatformAdmin = {
  id: string;
  email: string | null;
  nama_lengkap: string;
};

/** Landlord yang sedang login — total terpisah dari getCurrentProfile()/getCurrentTenant(). */
export async function getCurrentPlatformAdmin(): Promise<CurrentPlatformAdmin | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin } = await supabase
    .from("platform_admins")
    .select("profile_id")
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!admin) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama_lengkap")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    nama_lengkap: profile?.nama_lengkap ?? user.email ?? "Admin Platform",
  };
}
```

### 5.3 File baru — `src/lib/actions/platform-auth.ts`

Duplikasi sengaja dari `src/lib/actions/auth.ts` (bukan reuse) — sesuai keputusan "halaman dan fiturnya beda total". `signInAction`/`signOutAction` existing redirect hardcode ke `/admin`/`/admin/login`, tidak dipakai ulang di sini.

```ts
"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PlatformSignInState = { error: string | null };

export async function platformSignInAction(
  _prevState: PlatformSignInState,
  formData: FormData,
): Promise<PlatformSignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email dan kata sandi wajib diisi." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email atau kata sandi salah." };

  redirect("/platform");
}

export async function platformSignOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/platform/login");
}
```

### 5.4 File baru — `src/lib/actions/platform-tenants.ts`

```ts
"use server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
// ...validasi slug (regex sama seperti constraint DB) & nama via zod...

export async function createTenantAction(_prevState, formData) {
  // insert into tenants(slug, nama) — RLS is_platform_admin() menggerbangi.
  // revalidatePath("/platform");
}

export async function updateTenantStatusAction(tenantId: string, status: "active" | "suspended") {
  // update tenants set status = ... where id = tenantId
  // revalidatePath("/platform");
}

export async function inviteTenantAdminAction(_prevState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const tenantId = String(formData.get("tenant_id") ?? "");

  const serviceClient = createServiceRoleClient();

  // 1. Cek dulu apakah email sudah terdaftar (listUsers filter by email) —
  //    Supabase Admin API tidak punya "getUserByEmail" langsung di semua versi,
  //    jadi query listUsers({ page, perPage }) + filter, ATAU langsung panggil
  //    inviteUserByEmail() dan tangani error "User already registered" sebagai
  //    sinyal "sudah ada", lalu lookup ulang via auth.users/profiles.
  // 2. Kalau belum ada: serviceClient.auth.admin.inviteUserByEmail(email)
  //    → trigger handle_new_user() otomatis bikin baris `profiles`
  //      (role='operator', legacy field, tidak dipakai gating lagi).
  // 3. profileId didapat dari user.id hasil invite / lookup existing.
  // 4. Insert membership lewat client biasa (BUKAN service role — supaya
  //    tetap lewat RLS is_platform_admin() yang sudah benar):
  //      supabase.from("memberships").insert({ tenant_id: tenantId, profile_id: profileId, role: "admin" })
  //      .on_conflict(tenant_id, profile_id) do update set role='admin'
  // revalidatePath(`/platform/tenants/${tenantId}`);
}
```

**Detail kritis**: langkah invite (Supabase Auth Admin API) **wajib** `createServiceRoleClient()`. Langkah insert `memberships` **sebaiknya** tetap lewat `createSupabaseServerClient()` (client biasa, sesi landlord) supaya RLS `is_platform_admin()` yang baru benar-benar teruji jalan — bukan di-bypass diam-diam oleh service role.

### 5.5 File baru — `src/app/platform/**`

```
src/app/platform/
├── login/page.tsx              # form login landlord, terpisah dari /admin/login
└── (protected)/
    ├── layout.tsx               # cek getCurrentPlatformAdmin(), redirect /platform/login kalau bukan landlord
    ├── page.tsx                 # daftar tenant + form buat tenant baru
    └── tenants/[id]/page.tsx    # detail tenant: suspend/reaktivasi, form undang admin pertama
```

`(protected)/layout.tsx` — pola mirip `admin/(protected)/layout.tsx` tapi jauh lebih sederhana (tidak ada tenant/membership check, cuma satu gerbang `getCurrentPlatformAdmin()`):

```tsx
export default async function PlatformProtectedLayout({ children }) {
  if (!isSupabaseConfigured()) redirect("/platform/login");
  const admin = await getCurrentPlatformAdmin();
  if (!admin) redirect("/platform/login");
  return <div>{/* shell + nav landlord sendiri, BUKAN AdminSidebar/AdminTopbar */}{children}</div>;
}
```

### 5.6 File dimodifikasi — `src/middleware.ts`

```ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPlatformRoute = pathname.startsWith("/platform");

  const requestHeaders = new Headers(request.headers);

  // /platform TIDAK PERNAH melalui resolusi tenant — tidak ada query DB
  // tenant yang sia-sia, dan secara desain memastikan halaman landlord tidak
  // pernah kebocoran x-tenant-id/slug dari host yang sedang diakses.
  if (!isPlatformRoute) {
    const { tenant, source } = await resolveTenantForHost(request.headers.get("host") ?? "");
    if (tenant) {
      requestHeaders.set("x-tenant-id", tenant.id);
      requestHeaders.set("x-tenant-slug", tenant.slug);
    }
    requestHeaders.set("x-tenant-source", source);
  }

  const needsSession = pathname.startsWith("/admin") || isPlatformRoute;
  const response = needsSession
    ? await updateSession(request, requestHeaders)
    : NextResponse.next({ request: { headers: requestHeaders } });

  if (TENANT_DEBUG_HEADERS && !isPlatformRoute) {
    // ...tetap seperti sekarang, tidak berlaku untuk /platform...
  }
  return response;
}
```

`updateSession()` (`src/lib/supabase/middleware.ts`) **tidak perlu diubah** — logic redirect-nya sudah generik (`isLoginRoute = pathname === "/admin/login"`), tapi perlu diperluas mengenali `/platform/login` juga supaya user yang belum login tidak di-redirect-loop. Cek detail di §5.6.1 (lihat kode `updateSession` existing — perlu tambah cabang `isPlatformLoginRoute` paralel dengan `isLoginRoute`, redirect ke `/platform/login` kalau path diawali `/platform` dan user null, bukan ke `/admin/login`).

### 5.7 File yang **tidak** disentuh

`src/app/admin/**` seluruhnya, `src/lib/actions/auth.ts`, `src/lib/auth/current-profile.ts`, `src/lib/tenant/**`, semua query/action tenant-scoped dari Phase 4, `is_admin()`/`is_staff()`/`is_tenant_*()` (tetap dipakai tabel bisnis tenant-scoped, tidak diganti).

## 6. Alur Request

```
Request ke /platform/** → src/middleware.ts
  → deteksi isPlatformRoute=true → SKIP resolveTenantForHost sepenuhnya
  → updateSession(request, requestHeaders) — refresh cookie session, redirect
    ke /platform/login kalau belum login & bukan halaman login itu sendiri
  → src/app/platform/(protected)/layout.tsx
    → getCurrentPlatformAdmin() cek baris `platform_admins`
    → tidak ada baris → redirect /platform/login (BUKAN pesan "bukan anggota
      tenant" — landlord bukan konsep tenant sama sekali)
    → ada baris → render dashboard landlord
```

## 7. Alur Undang Admin Pertama (bagian paling rawan, detail teknis)

1. Landlord isi form: pilih tenant (baru dibuat, belum ada membership), masukkan email calon admin.
2. Server Action `inviteTenantAdminAction` pakai `createServiceRoleClient()`:
   - Coba `admin.inviteUserByEmail(email)`. Supabase mengirim email undangan berisi magic link set-password, dan **otomatis** membuat baris `auth.users` → trigger `handle_new_user()` (existing, `0003_triggers.sql`) otomatis bikin baris `profiles` (role default `'operator'`, field ini sekarang cuma legacy, tidak dipakai gating).
   - Kalau email **sudah terdaftar** sebelumnya (respons API menandai "already registered"), fallback: cari `profiles.id` yang cocok (via join ke `auth.users.email` — butuh service role karena `auth.users` tidak bisa di-query dari client biasa).
3. Setelah `profileId` didapat (baik dari invite baru atau lookup existing), **client biasa milik landlord** (bukan service role) insert `memberships (tenant_id, profile_id, role='admin')` — supaya RLS `is_platform_admin()` benar-benar jadi gerbang otoritas, bukan di-bypass diam-diam.
4. Kalau user itu login pertama kali (invite baru), dia otomatis punya 1 membership (`admin` di tenant yang baru dibuat) — **tidak ada** membership tenant lain, jadi begitu login ke `/admin`, `AdminProtectedLayout` (Modul 1, Phase 4) akan bekerja normal: resolve tenant dari host, cek membership, langsung dapat akses admin ke tenant barunya saja.

## 8. Suspend/Reaktivasi Tenant — cakupan fungsional (baca sebelum implementasi)

`tenants.status` sudah ada sejak Phase 3 tapi **tanpa efek fungsional** ("TANPA efek fungsional apa pun di Phase 3"). PRD ini memberi efek **terbatas**, bukan penuh:

- **Yang DIUBAH**: `AdminProtectedLayout` (`src/app/admin/(protected)/layout.tsx`) — setelah `getCurrentTenant()`, tambah satu query ringan cek `tenants.status` untuk `tenant.id` yang sedang diakses (atau sertakan `status` di payload resolver supaya tidak perlu query tambahan — lihat `TenantResolverStrategy`, kolom `status` sebenarnya sudah ke-select tapi belum diteruskan ke header). Kalau `status === 'suspended'`, tampilkan notice "Situs ini sedang dinonaktifkan platform" dan blokir akses dashboard (mirip pola notice membership Modul 1), terlepas dari role/membership admin tenant tersebut.
- **Yang TIDAK diubah**: halaman **publik** desa yang suspended tetap render normal seperti biasa. Maintenance page publik adalah follow-up terpisah (§3 Non-Goals) — dianggap cukup rendah risiko untuk MVP karena landlord adalah fitur internal, kemungkinan tenant di-suspend sambil publiknya masih tampil itu jendela waktu pendek yang bisa diterima.

Ini keputusan scoping yang **perlu direview eksplisit** oleh Anda sebelum implementasi — kalau ternyata suspend HARUS langsung memblokir situs publik juga, itu memperbesar scope PRD ini (nyentuh resolver + kemungkinan halaman baru `src/app/suspended/page.tsx` + logic tambahan di `resolveTenantForHost`).

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| `platform_admins` kosong setelah migrasi (tidak ada landlord) → tidak ada yang bisa akses `/platform` sama sekali | TODO eksplisit di migrasi §4.1 untuk insert baris landlord pertama sebelum apply, sama pola dengan seed tenant default di 0009 |
| `inviteUserByEmail` gagal (rate limit, email invalid, SMTP belum dikonfigurasi di project Supabase) | Server Action kembalikan pesan error jelas ke landlord, tidak ada partial state (kalau invite gagal, tidak ada baris `profiles`/`memberships` yang sempat dibuat) |
| Race condition: dua landlord invite admin yang sama untuk tenant yang sama bersamaan | `on conflict (tenant_id, profile_id) do update set role='admin'` di insert membership — idempotent |
| Lupa bahwa `/platform` tidak melalui resolusi tenant → kode landlord tidak sengaja memanggil `getCurrentTenant()` dan dapat data tidak terdefinisi/default yang membingungkan | Dicatat eksplisit di §5.7 "file yang tidak disentuh" — halaman `/platform/**` tidak boleh mengimpor apa pun dari `src/lib/tenant/**` |
| `SUPABASE_SERVICE_ROLE_KEY` tidak diset di Vercel production sebelum fitur invite dipakai | `createServiceRoleClient()` throw error eksplisit (bukan diam-diam gagal) kalau key kosong — lihat §5.1 |
| Perbaikan RLS `is_admin()` → `is_platform_admin()` di `tenants`/`memberships` mematahkan sesuatu yang diam-diam bergantung pada `is_admin()` lama untuk 2 tabel ini | Digrep dulu sebelum apply: pastikan tidak ada kode aplikasi lain yang mengasumsikan admin desa bisa CRUD tenant/memberships langsung dari client (setahu riset, tidak ada — hanya dipakai lewat SQL manual sejauh ini) |

## 10. Rollback Strategy

- **Migrasi SQL**: `drop policy` yang baru + `drop function is_platform_admin()` + `drop table platform_admins` lalu re-create 3 policy lama persis seperti di `0009_tenants_foundation.sql` (arsipkan snippet-nya di deskripsi PR, bukan file baru) — aman karena additive-only sampai ke titik ini.
- **File `src/app/platform/**`, `src/lib/actions/platform-*.ts`, `src/lib/auth/current-platform-admin.ts`, `src/lib/supabase/service.ts`**: dead code sampai diakses lewat `/platform` — hapus foldernya tidak berdampak fitur lain.
- **Middleware**: perubahan `src/middleware.ts` di PRD ini murni menambah cabang `isPlatformRoute`, tidak mengubah cabang existing (`/admin`, publik) — `git revert` pada commit ini saja cukup.

## 11. Testing Checklist

- [ ] `npm run build` sukses.
- [ ] Migrasi `0014` diterapkan; landlord pertama (dari TODO seed) bisa login ke `/platform/login` dan masuk `/platform`.
- [ ] Akun admin desa biasa (bukan landlord) mencoba akses `/platform` → redirect ke `/platform/login`, **tidak** bisa masuk walau punya `profiles.role='admin'` global.
- [ ] Buat tenant baru dari `/platform` → baris `tenants` muncul, trigger `on_tenant_created_desa_profil` (Phase 4 Modul 2) tetap otomatis jalan seperti biasa.
- [ ] Undang admin pertama dengan email **baru** (belum pernah dipakai) → user menerima email undangan (cek Supabase Auth logs), setelah set password & login ke `/admin` di subdomain tenant tsb → langsung dapat akses admin, **tidak** dapat akses tenant lain manapun.
- [ ] Undang admin dengan email yang **sudah** terdaftar (mis. akun landlord sendiri, atau admin desa Sita) → tidak ada percobaan invite ulang yang error, langsung tertambah `memberships` baru untuk tenant tsb.
- [ ] Suspend tenant dari `/platform` → admin tenant tsb yang mencoba akses `/admin` (subdomain tenant tsb) dapat notice "dinonaktifkan", **situs publik tenant tsb tetap render normal**.
- [ ] Reaktivasi tenant → admin bisa akses `/admin` lagi seperti biasa.
- [ ] `select * from memberships` lewat client biasa (bukan landlord, bukan `auth.uid()` sendiri) → tidak lagi bisa lihat baris tenant lain (verifikasi perbaikan §4.2).
- [ ] Akses `coba.lvh.me:3000/platform` (atau host tenant manapun) → tetap render panel landlord yang sama, tidak terpengaruh subdomain (verifikasi §5.6 "skip resolusi tenant").

### Critical Files

- `supabase/migrations/0014_platform_admins.sql`
- `src/lib/supabase/service.ts`
- `src/lib/auth/current-platform-admin.ts`
- `src/lib/actions/platform-auth.ts`, `src/lib/actions/platform-tenants.ts`
- `src/app/platform/**`
- `src/middleware.ts`, `src/lib/supabase/middleware.ts`
- `src/lib/supabase/database.types.ts`
