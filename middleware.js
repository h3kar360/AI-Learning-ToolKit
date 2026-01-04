import { createServerSupabase } from "./lib/supabaseServer";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const res = NextResponse.next();

    const supabaseUser = createServerSupabase();

    const {
        data: { session },
    } = await supabaseUser.auth.getSession();

    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        return res;
    }

    if (!session) {
        return NextResponse.redirect(new URL("/signup", req.url));
    }

    //pass the user id through headers
    res.headers.set("x-user-id", session.user.id);

    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
