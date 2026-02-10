"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    const { data: session, isPending } = authClient.useSession();

    const [auth, setAuth] = useState(false);

    /* Check user auth then display either login prompts or a link to dashboard
    */
    useEffect(() => {
        if (isPending) return;

        if (!session?.user) 
            return

        setAuth(true);
    }, [isPending]);

    return (<header className="w-screen h-14 flex justify-between items-center bg-slate-800 text-background dark:text-foreground dark:bg-slate-900 border-b-2 border-slate-950 px-8 font-sans">
        <Link href="/" className="text-2xl">Hotel Finder</Link>
        <div className="text-xl flex gap-4">
            {auth ? 
                <>
                    <Link href="/dashboard" className="">Dashboard</Link>
                </>:
                <>
                    <Link href="/login" className="font-semibold p-1 pl-3 pr-3 bg-slate-100 text-slate-900 rounded-2xl">Login</Link>
                    <Link href="/signup" className="font-semibold p-1 pl-3 pr-3 bg-slate-100 text-slate-900 rounded-2xl">Sign up</Link>
                </>
            }
        </div>
    </header>)
}