"use client";

import Image from "next/image"; 
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { type DateRange } from "react-day-picker";
import Header from "@/components/header";

export default function Home() {
  const Router = useRouter();

  const [search, setSearch] = useState("");
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [guests, setGuests] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    console.log("Search:", search);
    console.log("Date Range:", dateRange);
    console.log("guest count: ", guests);

    const params = new URLSearchParams();
    
    params.set("search", search);
    params.set("guests", guests);

    params.set(
      "date",
      JSON.stringify({
        from: dateRange?.from?.toISOString(),
        to: dateRange?.to?.toISOString()
      }
    ));
    
    Router.push(`/search?${params.toString()}`);

    console.log(params.toString());
  };

  return (
    <div>
      <Header/>

      <div className="w-screen h-[50vh] relative">
        <Image
          src="/hotel.jpg"
          alt="bar"
          width={1920}
          height={1080}
          style={{ objectFit: "cover", width: "100vw", height: "95vh"}}
          className="blur-out-2xl"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-3/6 h-1/6 flex items-center justify-center p-4">
            <form onSubmit={submit} className="flex w-full justify-between items-center gap-4">
              
              <div className="flex flex-col justify-center p-2 hover:bg-slate-100 rounded-lg">
                <p className="text-sm font-semibold text-red-600">Where to?</p>
                <InputGroup className="w-40 border-none shadow-none focus-within:ring-0">
                  <InputGroupInput
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-none shadow-none focus:ring-0 focus:outline-none"
                  />
                </InputGroup>
              </div>

              <div className="flex flex-col justify-center relative hover:bg-slate-100 p-2 rounded-lg">
                <p
                  className="text-sm font-semibold text-red-600 cursor-pointer ml-8"
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
                <Select required={true} onValueChange={setGuests}>
                  <SelectTrigger className="w-45 h-10 border-0 shadow-none hover:bg-slate-100">
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
        </div>
      </div>

    </div>
  );
}
