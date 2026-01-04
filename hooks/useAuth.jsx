"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const useAuth = () => {
    const [session, setSession] = useState(null);

    useEffect(async () => {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_e, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return session;
};

export default useAuth;
