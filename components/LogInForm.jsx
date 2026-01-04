"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const LogInForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const signup = async (e) => {
        e.preventDefault();

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
                options: {
                    persistSession: true,
                },
            });

            if (error) setError(error.message);
            else router.push("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form
            className="flex flex-col w-125 h-150 items-center justify-evenly border rounded-2xl"
            onSubmit={signup}
        >
            <div className="text-6xl">Log In</div>
            <input
                type="text"
                name="email"
                placeholder="E-mail"
                className="bg-white placeholder-gray-500 rounded-xl py-2 px-3 w-[calc(100%-10rem)] text-black"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="bg-white placeholder-gray-500 rounded-xl py-2 px-3 w-[calc(100%-10rem)] text-black"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                type="submit"
                className="border w-[calc(100%-10rem)] py-3 text-2xl rounded-2xl hover:bg-white hover:text-black"
            >
                Log in account
            </button>
            <div className="flex gap-1">
                <div>Don't have an account?</div>
                <Link
                    href="/login"
                    className="text-blue-500 hover:text-blue-400"
                >
                    sign up
                </Link>
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default LogInForm;
