import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const id=req.nextUrl.searchParams.get('id');

    const user=await prisma.user.findUnique({
        where:{
            id:Number(id)
        }
    })
    return NextResponse.json({user:user},{status:201});

}