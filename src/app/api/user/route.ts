import { NextRequest, NextResponse } from "next/server";
import { auth, getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
  
    const user = await getUser(session.user.id);

    console.log(user);
    
    return NextResponse.json({
        message: "Authenticated",
        data: user
    });
}