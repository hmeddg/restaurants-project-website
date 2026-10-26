import { NextResponse, type NextRequest } from "next/server";
import { isMenuCategory } from "@/lib/menu/categories";

// The menu page streams, so a notFound() inside it would already have sent a
// 200. Rejecting unknown categories here returns a real 404 status instead.
export function proxy(request: NextRequest) {
  const category = request.nextUrl.pathname.split("/")[2] ?? "";
  if (!isMenuCategory(category)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), {
      status: 404,
    });
  }
}

export const config = {
  matcher: "/menu/:category",
};
