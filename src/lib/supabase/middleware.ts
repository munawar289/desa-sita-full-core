import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Menyegarkan sesi Supabase Auth di setiap request ke `/admin/*` dan menjaga
 * gerbang login — PRD §10: "Middleware Next.js mengecek sesi di setiap
 * request ke /admin/*, redirect ke /admin/login kalau belum login."
 *
 * `requestHeaders` diteruskan dari src/middleware.ts (berisi header tenant
 * x-tenant-id/x-tenant-slug) supaya tetap terbawa ke Server Component setelah
 * refresh cookie session — tanpa ini, header tenant hilang begitu Supabase
 * membangun response barunya sendiri lewat NextResponse.next({ request }).
 */
export async function updateSession(
  request: NextRequest,
  requestHeaders: Headers,
) {
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // Selama Supabase belum dikonfigurasi, biarkan lewat — src/app/admin/layout.tsx
  // yang menampilkan pesan "belum terhubung" alih-alih redirect loop/crash.
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request: { headers: requestHeaders } });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}
