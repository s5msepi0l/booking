"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Header() {
    useEffect(() => {
        /* Check user auth then display either login prompts or a link to dashboard
        */

    }, []);

    return (<header className="w-screen h-14 flex justify-between items-center bg-slate-800 text-background dark:text-foreground dark:bg-slate-900 border-b-2 border-slate-950 px-8 font-sans">
        <Link href="/" className="text-2xl">Hotel Finder</Link>
        <div className="text-xl flex gap-4">
          <Link href="/login" className="font-semibold p-1 pl-3 pr-3 bg-slate-100 text-slate-900 rounded-2xl">Login</Link>
          <Link href="/signup" className="font-semibold p-1 pl-3 pr-3 bg-slate-100 text-slate-900 rounded-2xl">Sign up</Link>
        </div>
    </header>)
}