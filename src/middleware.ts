import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { resolveTenantForHost } from "@/lib/tenant/resolve-tenant";
import { TENANT_DEBUG_HEADERS } from "@/lib/tenant/env";
import { isLandlordOnlyHost } from "@/lib/tenant/landlord-host";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Seluruh /platform (termasuk landing page publik /platform) tidak pernah
  // melalui resolusi tenant — landlord bukan konsep tenant sama sekali.
  const isPlatformRoute = pathname.startsWith("/platform");
  // Hanya /platform/login + /platform/dashboard/* yang digerbangi sesi —
  // /platform sendiri adalah landing page publik (overview program), tidak
  // boleh me-redirect pengunjung yang belum login.
  const isPlatformAuthRoute =
    pathname === "/platform/login" || pathname.startsWith("/platform/dashboard");

  // Root TENANT_BASE_DOMAIN (tanpa subdomain, mis. lvh.me:3000) didedikasikan
  // untuk /platform — route tenant (publik maupun /admin) TIDAK BOLEH resolve
  // ke tenant default di domain landlord ini, supaya benar-benar terpisah
  // dari desa manapun. Setiap desa wajib punya subdomain/domain sendiri.
  if (!isPlatformRoute && isLandlordOnlyHost(request.headers.get("host") ?? "")) {
    return NextResponse.redirect(new URL("/platform", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  let tenant = null;

  // /platform TIDAK PERNAH melalui resolusi tenant — landlord bukan konsep
  // tenant sama sekali, dan ini menghindari query DB tenant yang sia-sia +
  // memastikan panel landlord tidak pernah kebocoran x-tenant-id/slug dari
  // host yang sedang diakses.
  if (!isPlatformRoute) {
    const resolved = await resolveTenantForHost(request.headers.get("host") ?? "");

    // Host berbentuk subdomain tenant (mis. desaxx.lvh.me) tapi tenant-nya
    // tidak ada — tolak eksplisit, JANGAN diam-diam menampilkan tenant
    // default (kebocoran data desa lain ke subdomain yang salah/tidak ada).
    if (resolved.source === "unknown-subdomain") {
      return new NextResponse("Forbidden: subdomain tidak dikenali.", {
        status: 403,
      });
    }

    tenant = resolved.tenant;
    if (tenant) {
      requestHeaders.set("x-tenant-id", tenant.id);
      requestHeaders.set("x-tenant-slug", tenant.slug);
      requestHeaders.set("x-tenant-status", tenant.status);
    }
    // Dibaca getCurrentTenant() (Phase 4 Modul 1) untuk membedakan "resolver
    // gagal, fallback ke default" vs "memang tenant default" saat membership
    // check gagal — supaya pesan ke staff tidak generik/membingungkan.
    requestHeaders.set("x-tenant-source", resolved.source);
  }

  const needsSession = pathname.startsWith("/admin") || isPlatformAuthRoute;
  const response = needsSession
    ? await updateSession(request, requestHeaders, {
        loginPath: isPlatformAuthRoute ? "/platform/login" : "/admin/login",
        homePath: isPlatformAuthRoute ? "/platform/dashboard" : "/admin",
      })
    : NextResponse.next({ request: { headers: requestHeaders } });

  if (TENANT_DEBUG_HEADERS && tenant) {
    response.headers.set("x-tenant-slug", tenant.slug);
  }
  return response;
}

export const config = {
  // File statis (mis. /images/logo.webp) SENGAJA dikecualikan lewat pola
  // ".*\\..*" — kalau tidak, request-nya ikut kena redirect landlord-only
  // host di atas dan bikin Next.js Image Optimization di Vercel gagal
  // (optimizer fetch source lewat HTTP, dapat HTML redirect, bukan gambar).
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)"],
};
