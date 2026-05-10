import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;

    if (!token && !request.nextUrl.pathname.startsWith("/login")) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    NextResponse.next();
}
 
export const config = {
    matcher: ["/dashboard/:path*"]
};