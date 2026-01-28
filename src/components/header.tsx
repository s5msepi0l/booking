"use client";

import Link from "next/link";

export default function Header() {
    return (<header className="w-screen h-14 flex justify-between items-center bg-slate-100 text-black dark:bg-slate-950 dark:text-white px-8 font-sans">
        <div className="text-xl">Hotel Finder</div>
        <div className="text-xl flex gap-4">
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign up</Link>
        </div>
    </header>)
}