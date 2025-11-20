import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export const POST = async (req: Request) => {
    const body = await req.json();

    const res = new NextResponse(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
            "content-type": "application/json",
            "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            pragma: "no-cache",
            expires: "0",
            "surrogate-control": "no-store",
        },
    });

    const baseCookie = {
        httpOnly: true as const,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    };

    if (body.accessToken) {
        res.cookies.set("token", body.accessToken, {
            ...baseCookie,
            ...(body.accessTokenExpiresAtUtc
                ? { expires: new Date(body.accessTokenExpiresAtUtc) }
                : {}),
        });
    }

    if (body.refreshToken) {
        res.cookies.set("refresh_token", body.refreshToken, {
            ...baseCookie,
            ...(body.refreshTokenExpiresAtUtc
                ? { expires: new Date(body.refreshTokenExpiresAtUtc) }
                : {}),
        });
    }

    if (body.role) {
        res.cookies.set("role", body.role, {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            httpOnly: false,
            ...(body.accessTokenExpiresAtUtc
                ? { expires: new Date(body.accessTokenExpiresAtUtc) }
                : {}),
        });
    }

    return res;
};

export const DELETE = async () => {
    const res = new NextResponse(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
        },
    });

    for (const name of ["token", "refresh_token", "role"]) {
        res.cookies.set(name, "", { path: "/", expires: new Date(0) });
    }

    return res;
};