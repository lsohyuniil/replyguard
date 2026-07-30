import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createSessionExpiredLoginUrl } from "@/lib/auth/login-redirect";
import { getSupabasePublicConfig } from "./config";

export async function refreshSupabaseSession(request: NextRequest) {
  const { url, key } = getSupabasePublicConfig();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();
  const signedIn = !error && Boolean(data?.claims.sub);
  const onLoginPage = request.nextUrl.pathname === "/login";

  if (!signedIn && !onLoginPage) {
    return NextResponse.redirect(
      createSessionExpiredLoginUrl(request.url),
    );
  }

  if (signedIn && onLoginPage) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}
