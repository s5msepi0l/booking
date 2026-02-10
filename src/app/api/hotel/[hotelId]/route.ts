import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params } : { params: { hotelId: string } }
) {
    const { hotelId } = await (params);
    const Id = parseInt(hotelId);
  
    const hotels = await prisma.hotel.findUnique({where: {id: Id}})
    console.log("hotel: ", hotelId);
    
    return NextResponse.json({
        data: hotels
    })
}