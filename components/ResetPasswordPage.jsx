"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

const ResetPasswordPage = () => {
    const searchParams = useSearchParams();

    const code = searchParams.get("code");

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (code) supabase.auth.setSession(code);
    }, [code]);

    const handleReset = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage("Password updated successfully!");
        }
    };

    return (
        <form
            className="flex flex-col w-125 h-150 items-center justify-evenly border rounded-2xl"
            onSubmit={handleReset}
        >
            <div className="text-6xl">Reset Password</div>
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
                Reset password
            </button>

            {message && <p className="text-red-500">{message}</p>}
        </form>
    );
};

export default ResetPasswordPage;
