import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // Get query params
    const amenitiesParam = searchParams.get("amenities");
    const nameParam = searchParams.get("name");

    // Convert amenities string to array and make all uppercase
    const amenities: string[] = amenitiesParam
        ? amenitiesParam.split(",").map(a => a.toUpperCase())
        : [];

    // Build the "where" object explicitly
    const where: any = {};

    if (amenities.length > 0) {
        where.amenities = {
            hasEvery: amenities,
        };
    }

    if (nameParam && nameParam.trim() !== "") {
        where.name = {
            contains: nameParam,
            mode: "insensitive",
        };
    }

    // Query the database
    const hotels = await prisma.hotel.findMany({
        where,
    });

    // Return the data
    return NextResponse.json({ data: hotels });
}

/*
       await prisma.hotel.createMany({
    data: [
        {
        name: "Ocean View Resort",
        description: "Luxury beachfront resort with stunning ocean views.",
        address: "123 Beach Road, Miami, FL",
        Price: "250",
        images: [
            "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["POOL", "WIFI", "GYM", "BREAKFAST"],
        city: "Florida"
        },
        {
        name: "Mountain Escape Lodge",
        description: "Peaceful mountain retreat surrounded by nature.",
        address: "45 Alpine Way, Aspen, CO",
        Price: "320",
        images: [
            "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["SPA", "SAUNA", "WIFI", "PARKING"],
        city: "Colorado"
        },
        {
        name: "City Lights Hotel",
        description: "Modern hotel in the heart of downtown.",
        address: "88 Main Street, New York, NY",
        Price: "180",
        images: [
            "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["WIFI", "GYM", "RESTAURANT", "BAR"],
        city: "New York City"
        },
        {
        name: "Desert Palm Resort",
        description: "Relaxing oasis in the desert with palm gardens.",
        address: "9 Oasis Blvd, Phoenix, AZ",
        Price: "210",
        images: [
            "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["POOL", "SPA", "RESTAURANT"],
        city: "Arizona"
        },
        {
        name: "Lakeside Inn",
        description: "Cozy inn with beautiful lake views.",
        address: "77 Lake Drive, Lake Tahoe, CA",
        Price: "160",
        images: [
            "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["WIFI", "BREAKFAST", "PARKING"],
        city: "California"
        },
        {
        name: "Royal Grand Hotel",
        description: "Elegant hotel offering premium services.",
        address: "1 King Street, London, UK",
        Price: "400",
        images: [
            "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["SPA", "GYM", "RESTAURANT", "BAR"],
        city: "London"
        },
        {
        name: "Forest Hideaway",
        description: "Hidden gem surrounded by lush forests.",
        address: "300 Pine Road, Portland, OR",
        Price: "140",
        images: [
            "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["WIFI", "SAUNA", "PARKING"],
        city: "Portland"
        },
        {
        name: "Sunset Bay Hotel",
        description: "Perfect spot to enjoy sunsets by the sea.",
        address: "500 Sunset Ave, San Diego, CA",
        Price: "230",
        images: [
           "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["POOL", "BAR", "WIFI"],
        city: "San Diego"
        },
        {
        name: "Business Plaza Hotel",
        description: "Ideal hotel for business travelers.",
        address: "10 Corporate Way, Chicago, IL",
        Price: "190",
        images: [
            "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["WIFI", "GYM", "CAFE", "PARKING"],
        city: "Chicago"
        },
        {
        name: "Island Breeze Resort",
        description: "Tropical paradise with island vibes.",
        address: "2 Palm Island, Honolulu, HI",
        Price: "350",
        images: [
            "/pool.jpg",
            "/bar.jpg",
            "/hotel.jpg"
        ],
        amenities: ["POOL", "SPA", "BREAKFAST", "BAR"],
        city: "Honolulu"
        },
    ],
    });
*/