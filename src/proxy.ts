import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasValidBasicAuth } from "@/lib/basic-auth";

export async function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    !hasValidBasicAuth(request.headers.get("authorization"))
  ) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Commerce Cockpit", charset="UTF-8"',
        "Cache-Control": "no-store",
      },
    });
  }

  const pathname = request.nextUrl.pathname;
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.email !== "dominik.rubroeder@mediawave.de") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

// Include pages, APIs, public assets, and Next.js bundles in the production gate.
export const config = { matcher: ["/:path*"] };
