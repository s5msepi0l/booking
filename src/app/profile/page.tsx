"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function Profile() {
    const Router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        /*  Check auth
                if not auth goto /login
            else 
                get user data from /api/user
                present list of bookings past and present
                to view or update click specific booking
                that should link to a /booking so user can cancel or view it
        
        */
        if (isPending) {
            return;
        }

        if (!session) { 
            Router.push("/login");
        }

        (async() => {
            const response = await fetch(`/api/user`);
            const data = await response.json();

            console.log(data?.data);
        })()


    }, [isPending])

    
    return <div>
        {JSON.stringify(session)}
    </div>
}