"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import Header from "@/components/header";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { number } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"]
})


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";

interface Hotel {
	id: number;
	name: string;
	description: string;
	address: string;
	city: string;
	images: string[];
	amenities: string[];
	Price: string;
}

export default function Dashboard() {
    const Router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    
	const [bookings, setBookings] = useState<{
		id: number
		room_number: string
		hotelId: number
		userId: string
		checkIn: string
		checkOut: string
		guests: number
		createdAt: string
		status: string

		hotel: Hotel | null

	}[] | null>([]);

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
            const response = await fetch("/api/book");
            let data = await response.json();

			if (!data?.data) return;

			if (data?.data) {
				for (let i = 0; i < data?.data.length; i++) {
					const booking = data?.data[i];
					const hotelResponse = await fetch(`/api/hotel/${booking.hotelId}`);
					const hotel = await hotelResponse.json();

					if (hotel) {
						data.data[i].hotel = hotel.data;
					}
					
				}
			}

			setBookings(data.data);
			console.log(data.data);
        })()


    }, [isPending])

	const cancel = async (id: number) => {
		const response = await fetch("/api/book", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				bookingId: id
			}),
		});

		const data = await response.json();

		console.log(data);
	}

	if (bookings)
    return <div className="flex flex-col items-center gap-4 min-h-screen">
        <Header/>
		<Card className="flex items-center w-2/3">
		<div className={`grid grid-cols-3 w-4/6 font-light text-xl ${montserrat.className}`}>
		<h1>Hotel name</h1>
		<h1>Status</h1>
		<h1>Date</h1>
		</div>

		{
			bookings.map((booking, index) => (
				<Card key={index} className="
					flex
					flex-col
					
					items-center
					justify-evenly

					w-4/5
					h-25
				">
					<div className="w-full flex flex-row-reverse items-center justify-around h-5">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									Manage
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end">
								<Dialog>
									<DialogTrigger>
										<DropdownMenuLabel>View details</DropdownMenuLabel>
									</DialogTrigger>
									
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Booking details</DialogTitle>
											
											<DialogContent>
												<DialogTitle>{booking.hotel?.name}</DialogTitle>
												<p> Address {booking.hotel?.address}</p>
												<p> Check in date {new Date(booking.checkIn).toLocaleDateString("en-ca")}</p>
												<p> Check out date {new Date(booking.checkOut).toLocaleDateString("en-ca")}</p>
												<p> Room number: "{booking.room_number}"</p>
												<p></p>

											</DialogContent>
										</DialogHeader>
									</DialogContent>
								</Dialog>

								<DropdownMenuSeparator />

								<DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => cancel(booking.id)}>
								Cancel booking
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<h1>{new Date(booking.checkIn).toLocaleDateString("en-ca")}</h1>
						<h1>{booking.status}</h1>
						<h1>{booking.hotel?.name}</h1>
					</div>
					
					<CardFooter className="flex flex-row w-full gap-8">
						{booking.hotel!.amenities.map((item, index) => (
							<Badge variant="outline" key={index} className="flex flex-row items-center justify-center w-32 h-6">
								<Image src={`/amenities/${item}.png`} width={18} height={18} className="max-w-5 dark:invert" alt="wifi"/>
								<h1 className="text-sm text-muted-foreground">{item}</h1>
								
							</Badge>
						))}
					</CardFooter>
				</Card>
			))
		}
		</Card>
    </div>
}