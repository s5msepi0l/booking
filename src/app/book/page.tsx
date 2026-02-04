"use client";

import { authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Book() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: session, isPending } = authClient.useSession();

    const [hotelId, setHotelId] = useState("");
    const [date, setDate]       = useState("");
    const [guests, setGuests]   = useState(0);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Function to create booking
    const createBooking = async () => {
        if (!hotelId || !date) {
            console.error("Missing required params");
            return;
        }

        setLoading(true);

        try {
            const parsedDate = JSON.parse(date);
            const res = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    hotelId: parseInt(hotelId),
                    checkIn: parsedDate.from,
                    checkOut: parsedDate.to,
                    guests: guests || "1"
                })
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Booking successful!", data);
                setBookingId(data.bookingId);
            } else {
                console.error("Booking failed:", data.error);
            }
        } catch (err) {
            console.error("Booking error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Read URL params & check authentication
    useEffect(() => {
        if (isPending) return;

        if (!session?.user) {
            router.push("/login");
            return;
        }

        const idParam = searchParams.get("id");      // hotel ID
        const dateParam = searchParams.get("date");  // JSON string
        const guestsParam = parseInt(searchParams.get("guests") || "0");

        if (idParam) setHotelId(idParam);
        if (dateParam) setDate(dateParam);
        if (guestsParam) setGuests(guestsParam);

        console.log("session:", JSON.stringify(session));
        console.log("URL params:", { idParam, dateParam, guestsParam });
    }, [isPending, session, searchParams]);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Booking Page</h1>
            <button onClick={createBooking}>Book</button>
            <p>id: {bookingId}</p>
        </div>
    );
}