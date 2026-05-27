import { createServerSupabase } from "./lib/supabaseServer";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const res = NextResponse.next();

    const supabaseUser = createServerSupabase();

    const {
        data: { user },
    } = await supabaseUser.auth.getUser();

    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        return res;
    }

    if (!user) {
        if (pathname.startsWith("/api")) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid session token" },
                { status: 401 },
            );
        }

        return NextResponse.redirect(new URL("/signup", req.url));
    }

    res.headers.set("x-verified-user-id", user.id);

    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|reset-password).*)"],
};
