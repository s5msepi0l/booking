"use client";

import Header from "@/components/header";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { type DateRange } from "react-day-picker";

import { Suspense } from "react";

const filterOptions = [
  "POOL",
  "SPA",
  "SAUNA",
  "WIFI",
  "GYM",
  "RESTAURANT",
  "BREAKFAST",
  "BAR",
  "CAFE",
  "ROOM_SERVICE",
  "PARKING",
  "SHOPPING",
  "GOLF"
];

interface Hotel {
    amenities: string[];
    [key: string]: any;
}

function SearchContent() {
    const Router = useRouter();
    const searchParams = useSearchParams();

    const [hotelData, setHotelData] = useState<Hotel[]>([]);
    const [filter, setFilter] = useState<string[]>([]);

    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const [searchBar, setSearchBar] = useState("");
    
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [calendarOpen, setCalendarOpen] = useState(false);

    const [guests, setGuests] = useState("");

    const submit = async(e: any) => {    
        e.preventDefault();
        //console.log("Search:", searchBar);
        //console.log("Date Range:", dateRange);
        //console.log("guest count: ", guests);
    }

    const book = async(id: number) => {
        const hotel = hotelData[id];

        console.log("params: ", searchParams)
        console.log(`hotel (${id}): ${hotel.id}`)

        const params = new URLSearchParams();

        const dateValue = searchParams.get("date");
        params.set("date", dateValue && dateValue !== "" ? dateValue : "")
    
        const guest = searchParams.get("guests");
        params.set("guests", guest && guest !== "" ? guest : "1")
    
        params.set("id", hotel.id);

        Router.push(`/book?${params.toString()}`);
    }

    const handleCheckboxChange = (amenity: string) => {
        setSelectedAmenities(prev => {
        if (prev.includes(amenity)) {
            // Remove if already selected
            return prev.filter(a => a !== amenity);
        } else {
            // Add if not selected
            return [...prev, amenity];
        }
        });
    };

    const refreshData = async() => {
        const params = new URLSearchParams();

        params.set("amenities", selectedAmenities.join(","));
        params.set("city", searchBar);

        const response = await fetch(`/api/hotels?${params.toString()}`, {method: "GET"});
        const data = await response.json();
        console.log("data: ", data.data);
        setHotelData(data?.data);
    }

    useEffect(() => {
        //console.log(selectedAmenities);
        refreshData();
    }, [selectedAmenities, searchBar])

    useEffect(() => {
        const rawDate = searchParams.get("date");
        console.log(rawDate);

        try {
            const raw = searchParams.get("date");
            if (raw) {
                const parsed = JSON.parse(raw);
                setDateRange({
                    from: new Date(parsed.from),
                    to: new Date(parsed.to),
                });
            }
        } catch {
            const today = new Date();

            setDateRange({
                from: today,
                to: today
            })
        }

        const search = searchParams.get("search");
        if (search) {
            setSearchBar(search);
        } else {
            setSearchBar("");
        }

        const guest = searchParams.get("guests");
        if (guest) {
            setGuests(guest);
        } else {
            setSearchBar("1");
        }

        setFilter([
            "Pool",
            "Spa",
            "Sauna",
            "Wifi",
            "Gym",
            "Restaurant",
            "Breakfast",
            "Bar",
            "Cafe",
            "Room_service",
            "Parking",
            "Shopping",
            "Golf"
        ]);

        (async() => {        
            const params = new URLSearchParams();

            params.set("amenities", selectedAmenities.join(","));
            params.set("city", searchParams.get("search") ?? "");

            const response = await fetch(`/api/hotels?${params.toString()}`, {method: "GET"});
            const data = await response.json();
            console.log("data: ", data.data);
            setHotelData(data?.data);
        })()

    }, [])
    
    if (filter.length === 0) return <div>Loading...</div>
    return <div className="min-h-screen">
            <Header/>
            <hr/>
            <main className="">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl w-full h-1/6 flex items-center justify-between p-4">
                    <form onSubmit={submit} className="flex w-full justify-around items-center gap-4">
                        <div className="flex flex-col justify-center p-2 hover:bg-slate-100 rounded-lg">
                            <p className="text-sm font-semibold text-red-600">Where to?</p>
                            <InputGroup className="w-40 border-none shadow-none focus-within:ring-0">
                            <InputGroupInput
                                placeholder="Search..."
                                value={searchBar}
                                onChange={(e) => setSearchBar(e.target.value)}
                                className="border-none shadow-none focus:ring-0 focus:outline-none"
                            />
                            </InputGroup>
                        </div>

                        <div className="flex flex-col justify-center relative hover:bg-slate-100 p-2 rounded-lg">
                            <p
                            className="text-sm font-semibold text-red-600 cursor-pointer"
                            onClick={() => setCalendarOpen(!calendarOpen)}
                            >
                            Date
                            </p>
                            <div
                            className="w-48 border rounded-md p-2 cursor-pointer hover:bg-slate-100 text-center border-none"
                            onClick={() => setCalendarOpen(!calendarOpen)}
                            >
                            {dateRange?.from && dateRange?.to ? (
                                <span>
                                {dateRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                                {dateRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                            ) : (
                                <span className="text-muted-foreground text-sm">Select a date range</span>
                            )}
                            </div>

                            {calendarOpen && (
                            <Card className="absolute top-16 z-10">
                                <CardContent className="p-0">
                                <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                    disabled={() => false}
                                />
                                </CardContent>
                            </Card>
                            )}
                        </div>

                        <div className="flex flex-col justify-center hover:bg-slate-100 p-2 rounded-lg">
                            <p className="text-sm font-semibold text-red-600">How many people are staying?</p>
                            <Select required={true} onValueChange={setGuests} value={guests}>
                            <SelectTrigger className="w-40 h-10 border-0 shadow-none hover:bg-slate-100">
                                <SelectValue placeholder="Amount of guests" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4+">4+</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            className="h-10 w-32 rounded-full bg-red-600 text-white border-none hover:bg-red-700"
                        >
                            Search
                        </Button>
                    </form>
                </div>
                <hr/>

                <h1 className="font-sans text-3xl ml-48 mt-12">{searchParams.get("search")} {hotelData.length.toString()} hotels</h1>

                <div className="flex  justify-center w-full mt-16 max-h-150">
                    <div className="p-8 rounded-xl mr-24">
                        <h1 className="text-red-900 font-bold text-3xl font-mono mb-4">Filter by</h1>
                        <h2 className="text-gray-900 text-2xl font-mono font-semibold mb-8">Hotel amenities</h2>
                        
                        <form className="flex flex-col">
                        {filter.map((amenity, index) => (
                            <label key={index} 
                            className="border-none cursor-pointer text-lg font-mono flex items-center">
                            
                            {hotelData.filter(hotel =>
                                hotel.amenities.includes(filterOptions[index])
                                ).length > 0 ? (
                                <>
                                    <input
                                    className="cursor-pointer w-9 h-5 rounded-full focus:ring-slate-500 focus:ring-2"
                                    type="checkbox"
                                    value={amenity}
                                    checked={selectedAmenities.includes(amenity)}
                                    onChange={() => handleCheckboxChange(amenity)}
                                    />
                                    <span>
                                    {amenity} (
                                        {hotelData.filter(hotel =>
                                            hotel.amenities.includes(filterOptions[index])
                                        ).length}
                                    )
                                    </span>
                                </>
                                ) : <>
                                    <input
                                        type="checkbox"
                                        disabled={true}
                                        checked={false}
                                        className="accent-blue-400 rounded-2xl border-none cursor-not-allowed w-9 h-5"
                                    />
                                        
                                        <span className="text-muted-foreground">
                                        {amenity}
                                        </span>
                                    </>
                                
                                }
                                
                            </label>
                        ))}
                        </form>
                    </div>

                    <ul className="w-3/6 h-full">
                        {hotelData.map((hotel, index) => (
                            <li key={index}
                                className="
                                    bg-slate-50 rounded-xl
                                    h-60
                                    mb-6
                                    overflow-hidden
                                    flex
                            ">
                                <div className="shrink-0 h-full max-w-80">
                                    <Image src={hotel.images[0]} alt="hotel image" className="rounded-l-xl" width={1920} height={1080} style={{objectFit: "cover", height: "100%"}}/>
                                </div>

                                <div className="flex">
                                    <div className="m-4 flex flex-col">
                                        <h1 className="text-2xl font-bold  mb-1">{hotel.name}</h1>
                                        <a target="_blank" href={`http://google.com`} className="cursor-pointer text-red-950 text-sm underline mb-4">{hotel.address}</a>
                                        <p className="mb-4"> {hotel.description}</p>

                                        <div className="flex overflow-auto">
                                            {hotel.amenities.map((item, index) => (
                                                <div key={index} className="flex">
                                                    <Image src={`/amenities/${item}.png`} width={20} height={20} alt={item}/>
                                                    <h1 className="ml-1 mr-3 text-sm text-muted-foreground">{item}</h1>
                                                </div>
                                            ))}
                                        </div>


                                    </div>

                                    <div>
                                        <p>Standard price</p>

                                        <div>
                                            <strong>From</strong>
                                            <p className="flex mb-8"><strong className="flex flex-row">{hotel.Price}<strong className="text-sm ml-1">EUR</strong></strong>/night </p>

                                            <button onClick={() => book(index)} className="
                                            text-xl font-mono font-bold text-white
                                            bg-red-500 hover:bg-red-700
                                            p-3 pl-6 pr-6
                                            rounded-full
                                            cursor-pointer
                                            ">
                                                See room
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>

        </div>
    
}

export default function Search() {
    return (<Suspense fallback={<div>Loading...</div>}>
        <SearchContent/>
    </Suspense>)
}