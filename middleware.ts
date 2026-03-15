import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!pathnameHasLocale) {
    // Redirect to default locale
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  // Pass current locale to the root layout via request headers
  const locale =
    locales.find(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
    ) ?? defaultLocale;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
