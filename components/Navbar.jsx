"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function Navbar() {
    const router = useRouter();
    const session = useAuth();
    const pathname = usePathname();

    const logout = async () => {
        await supabase.auth.signOut();
        router.push("/signup");
    };

    return (
        <nav className="flex items-center justify-between bg-black border-b-2 fixed h-20 inset-x-0 z-50">
            <div className="px-10 text-2xl">
                <Link href="/">AI Learning Toolkit</Link>
            </div>

            <button className="mx-10 px-5 py-2 rounded-xl hover:bg-white hover:text-black">
                {!session ? (
                    pathname === "/signup" ? (
                        <Link href="/login">Log In</Link>
                    ) : (
                        <Link href="/signup">Sign Up</Link>
                    )
                ) : (
                    <div onClick={logout}>Log Out</div>
                )}
            </button>
        </nav>
    );
}
