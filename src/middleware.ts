import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { resolveTenantForHost } from "@/lib/tenant/resolve-tenant";
import { TENANT_DEBUG_HEADERS } from "@/lib/tenant/env";

export async function middleware(request: NextRequest) {
  const { tenant, source } = await resolveTenantForHost(
    request.headers.get("host") ?? "",
  );

  const requestHeaders = new Headers(request.headers);
  if (tenant) {
    requestHeaders.set("x-tenant-id", tenant.id);
    requestHeaders.set("x-tenant-slug", tenant.slug);
  }
  // Dibaca getCurrentTenant() (Phase 4 Modul 1) untuk membedakan "resolver
  // gagal, fallback ke default" vs "memang tenant default" saat membership
  // check gagal — supaya pesan ke staff tidak generik/membingungkan.
  requestHeaders.set("x-tenant-source", source);

  const response = request.nextUrl.pathname.startsWith("/admin")
    ? await updateSession(request, requestHeaders)
    : NextResponse.next({ request: { headers: requestHeaders } });

  if (TENANT_DEBUG_HEADERS && tenant) {
    response.headers.set("x-tenant-slug", tenant.slug);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
