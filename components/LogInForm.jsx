"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const LogInForm = () => {
    //const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const login = async (e) => {
        e.preventDefault();

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
                options: {
                    persistSession: true,
                },
            });

            if (error) setError(error.message);
            else router.push("/");

            if (!data.session) setError("Incorrect email address or password");
        } catch (error) {
            console.error(error);
        }
    };

    const forgotPass = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: `http://localhost:3000/reset-password`,
            }
        );

        if (error) setError(error);

        alert("A reset password link has been sent to your e-mail");
    };

    return (
        <form
            className="flex flex-col w-125 h-150 items-center justify-evenly border rounded-2xl"
            onSubmit={login}
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
            <div>
                <p
                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                    onClick={() => forgotPass(email)}
                >
                    Forgot password?
                </p>
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default LogInForm;
