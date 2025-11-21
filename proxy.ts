import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAccess } from "./src/auth";
import { Role } from "./src/models";


export const proxy = (req: NextRequest) => {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;
    const role = (req.cookies.get("role")?.value ?? "") as Role;
    const hasRt = Boolean(req.cookies.get("refresh_token")?.value);

    if (!token && hasRt) return NextResponse.next();

    const redirectTo = checkAccess(pathname, Boolean(token), role);
    if (redirectTo) {
        const url = new URL(redirectTo, req.url);

        if (redirectTo === "/sign-in") url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
};

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};