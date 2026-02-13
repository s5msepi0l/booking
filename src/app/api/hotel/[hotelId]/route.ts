import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ hotelId: string }> }
) {
  const { hotelId } = await params;
  const id = parseInt(hotelId);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid hotel ID" },
      { status: 400 }
    );
  }

  const hotel = await prisma.hotel.findUnique({
    where: { id }
  });

  if (!hotel) {
    return NextResponse.json(
      { error: "Hotel not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: hotel });
}
