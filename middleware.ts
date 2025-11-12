import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAccess } from "./src/auth";
import { Role } from "./src/models";


export const middleware = (req: NextRequest) => {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;
    const role  = (req.cookies.get("role")?.value ?? "") as Role;

    const redirectTo = checkAccess(pathname, Boolean(token), role);
    if (redirectTo) return NextResponse.redirect(new URL(redirectTo, req.url));

    return NextResponse.next();
};

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};