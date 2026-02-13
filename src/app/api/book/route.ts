import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, getUser } from "@/lib/auth";
import { BookingStatus } from "@/generated/prisma/enums";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {
        return NextResponse.json(
            { error: "Unathorized" },
            { status: 401 }
        );
    }

    const user = await getUser(session.user.id);

    try {
        const body = await req.json();
        const { hotelId, checkIn, checkOut, guests} = body;

        if (!hotelId || !checkIn || !checkOut || !guests) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const hotel = await prisma.hotel.findUnique({
            where: {
                id: hotelId
            },
            select: {
                id: true
            }
        });

        if (!hotel) {
            return NextResponse.json(
                { error: "Hotel not found" },
                { status: 404 }
            );
        }

        const booking = await prisma.booking.create({
            data: {
                hotelId: hotelId,
                userId: user.id,
                room_number: String(Math.floor(Math.random() * 400)),
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                status: "CONFIRMED",
                guests
            },
            select: {
                id: true
            }
        });


        return NextResponse.json(
            { bookingId: booking.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("BOOKING ERROR:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {
        return NextResponse.json(
            { error: "Unathorized" },
            { status: 401 }
        );
    }

    const bookings = await prisma.booking.findMany({
        where: {
            userId: session.user.id
        }
    });

    return NextResponse.json(
        { data: bookings },
        { status: 200 }
    )
}

export async function UPDATE(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {
        return NextResponse.json(
            { error: "Unathorized" },
            { status: 401 }
        );
    }

    const { bookingId } = await req.json();

    const booking = prisma.booking.findUnique({
        where: {
            id: bookingId
        }
    })
}

export async function DELETE(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    });
    
    if (!session) {
        return NextResponse.json(
            { error: "Unathorized" },
            { status: 401 }
        );
    }

    try {
        const { bookingId } = await req.json();

        if (!bookingId) {
            return NextResponse.json(
            { error: "Invalid booking ID" },
            { status: 400 }
            );
        }

        const updated = await prisma.booking.update({
            where: { id: bookingId },
            data: {
            status: BookingStatus.CANCELLED,
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Cancel booking error:", error);

        return NextResponse.json(
            { error: "Failed to cancel booking" },
            { status: 500 }
        );
    }
}