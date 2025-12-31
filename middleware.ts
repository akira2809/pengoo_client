import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Debug logging (remove in production)
  console.log("🔄 Middleware triggered for:", pathname);

  // Redirect old URLs to new URLs structure
  if (pathname.startsWith("/product/")) {
    console.log("🔀 Redirecting product URL:", pathname);
    const newPath = pathname.replace("/product/", "/products/");
    const url = request.nextUrl.clone();
    url.pathname = newPath;

    // Use 301 redirect for SEO (permanent redirect)
    return NextResponse.redirect(url, 301);
  }

  // Redirect old collection URLs if they exist
  if (pathname.startsWith("/collection/")) {
    console.log("🔀 Redirecting collection URL:", pathname);
    const newPath = pathname.replace("/collection/", "/collections/");
    const url = request.nextUrl.clone();
    url.pathname = newPath;

    return NextResponse.redirect(url, 301);
  }

  // Redirect old blog URLs if they exist
  if (pathname.startsWith("/blog/")) {
    console.log("🔀 Redirecting blog URL:", pathname);
    const newPath = pathname.replace("/blog/", "/blogs/");
    const url = request.nextUrl.clone();
    url.pathname = newPath;

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // More explicit matchers
    '/product/(.*)',
    '/collection/(.*)', 
    '/blog/(.*)',
  ],
};
