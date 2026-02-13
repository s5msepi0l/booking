"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const signOut = async () => {
        await authClient.signOut();
        router.refresh();
        router.replace("/");
    };

    return (
        <header className="w-screen h-14 flex justify-between items-center bg-slate-800 text-background dark:text-foreground dark:bg-slate-900 border-b-2 border-slate-950 px-8 font-sans">
            <Link href="/" className="text-2xl">Hotel Finder</Link>

            <div className="text-xl flex gap-4">
                {session?.user ? (
                    <>
                        <Button onClick={signOut}>
                            Sign out
                        </Button>
                        <Button asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    </>
                ) : (
                    <>
                        <Button asChild>
                            <Link href="/login" className="font-semibold">
                                Login
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup" className="font-semibold">
                                Sign up
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}
