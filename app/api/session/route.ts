import { NextResponse } from "next/server";


export const POST = async (req: Request) => {
    const body = await req.json();

    const res = NextResponse.json({ ok: true });

    if (body.accessToken) {
        res.cookies.set("token", body.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: body.accessTokenExpiresAtUtc ? new Date(body.accessTokenExpiresAtUtc) : undefined,
            ...(body.rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
        });
    }

    if (body.refreshToken) {
        res.cookies.set("refresh_token", body.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: body.refreshTokenExpiresAtUtc ? new Date(body.refreshTokenExpiresAtUtc) : undefined,
            ...(body.rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
        });
    }

    if (body.role) {
        res.cookies.set("role", body.role, {
            httpOnly: false,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            ...(body.rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
            ...(body.accessTokenExpiresAtUtc ? { expires: new Date(body.accessTokenExpiresAtUtc) } : {}),
        });
    }

    return res;
};

export const DELETE = async () => {
    const res = NextResponse.json({ ok: true });

    for (const name of ["token", "refresh_token", "role"]) {
        res.cookies.set(name, "", { path: "/", expires: new Date(0) });
    }
    
    return res;
};