"use client";

import { authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Header from "@/components/header";

import { Montserrat } from "next/font/google";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"]
})



export default function Book() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: session, isPending } = authClient.useSession();

    const [hotelId, setHotelId] = useState("");
    const [date, setDate]       = useState("");
    const [guests, setGuests]   = useState(0);

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [calendarOpen, setCalendarOpen] = useState(false);

    const [bookingId, setBookingId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [hotel, setHotel] = useState<{
        id: number;
        name: string;
        description: string;
        address: string;
        city: string;
        images: string[];
        amenities: String[];
        Price: string;
    } | null>(null);

    const createBooking = async () => {
        console.log("create booking")
        /*
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
        }*/
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

        (async() => {
            const response = await fetch(`/api/hotel/${idParam}`);
            const data = await response.json()

            if (data) {
                setHotel(data.data);
            }
            console.log("hotel: ", JSON.stringify(data.data))
        })()

        
        //console.log("session:", JSON.stringify(session));
        //console.log("URL params:", { idParam, dateParam, guestsParam });
    }, [isPending, session, searchParams]);
    /*
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Booking Page</h1>
            <button onClick={createBooking}>Book</button>
            <p>id: {bookingId}</p>
        </div>
    );*/

    return <div className="
        w-full
        flex flex-col justify-center items-center
    ">
        <Header/>

        <Card className="flex flex-row justify-around  items-center bg-slate dark:bg-slate-950 border-0 dark:border-b-2 rounded-none">
            <div>
                <h1 className={`${montserrat.className} text-5xl font-normal mb-8`}>Book now</h1>

                <Card className="flex items-center p-8">
                    <Card
                        className="w-48 border rounded-md p-2 cursor-pointer hover:bg-slate-100 text-center"
                        onClick={() => setCalendarOpen(!calendarOpen)}
                    >
                        {dateRange?.from && dateRange?.to ? (
                        <span>
                            {dateRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                            {dateRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        ) : (
                        <span className="text-muted-foreground text-lg select-none">Select a date range</span>
                        )}
                    </Card>

                    { calendarOpen && <Card className="absolute mt-10">
                        <CardContent className="p-0">
                            <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            disabled={() => false}
                            />
                        </CardContent>
                    </Card>}

                    <div className="flex flex-col justify-center hover:bg-slate-100 p-2 rounded-lg">
                        <p className="text-lg font-semibold text-red-600">How many people are staying?</p>
                        <Select required={true} onValueChange={(value) => setGuests(value === "4+" ? 4 : parseInt(value))}>
                        <SelectTrigger className="w-40 h-10 border-0 shadow-none hover:bg-slate-100">
                            <SelectValue placeholder={guests != 0 ? guests: "guests"}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4+">4+</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <button onClick={createBooking}  className={`
                        bg-red-600
                        hover:bg-red-700
                        active:bg-red-800
                        text-white
                        font-bold text-xl
                        p-3 pl-5 pr-5 rounded-full
                        ${montserrat.className}
                    `}>Book hotel</button>
                </Card>
                <h1></h1>
            </div>

            <div className="w-6/12 mr-18 mt-8 flex flex-col items-center">
                <Carousel>
                    <CarouselContent className="gap-25">
                        {hotel?.images.map((item, index) => (
                            <CarouselItem key={index} className="flex justify-center">
                                <Image src={item} width={1920} height={1080} alt="hotel image" 
                                className="w-12/12 object-cover object-center rounded-lg" style={{height: "45vh"}}/>
                                
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>

                <h1 className="text-3xl font font-light text-background dark:text-foreground">Your <span className={`${montserrat.className} underline un font-extrabold text-3xl underline-offset-6 decoration-2`}>Adventure</span> starts <a>here</a></h1>
            </div>
        </Card>
    </div>
}