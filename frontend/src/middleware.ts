import { getSession } from "@/session/sessionUtils";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.url.includes("/api/")) {
    console.log("GET request to /api/, avoiding middleware");
    return NextResponse.next();
  }
  if (request.method === "GET") {
    console.log("middleware called");
    const session = await getSession();
    const { pathname } = request.nextUrl;

    console.log("pathname", pathname);

    if (!session?.token && pathname !== "/") {
      console.log(pathname, "without session, redirecting to /");
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/" && session?.token) {
      console.log("redirecting to /home");
      return NextResponse.redirect(new URL("/home", request.url));
    }

    return NextResponse.next();
  } else {
    console.log("Requisição POST para API, ignorando middleware");
  }
}

export const config = { matcher: ["/", "/home"] };
