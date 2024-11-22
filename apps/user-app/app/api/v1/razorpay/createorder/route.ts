import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { NEXT_AUTH } from "../../../../../lib/auth/auth";
import prisma from "@repo/db/client";

export async function POST(req:NextRequest){
    const {amount}:{amount:number}=await req.json();
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '',
        });

        const session = await getServerSession(NEXT_AUTH);

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized request" }, { status: 401 });
        }
  
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to smallest currency unit (e.g., paise for INR)
            currency: "INR",
            receipt: `user_${Number(session.user.id)}`, // Custom identifier for the transaction
            notes: { userId:Number(session.user.id) },
        });
        await prisma.razorpayTransaction.create({
            data:{
                userId:Number(session.user.id),
                status:"Processing",
                startTime:new Date(),
                orderId:order.id,
                amount:Number(order.amount)
            }
        })
        
        return NextResponse.json({ order,details:{name:session.user.name,email:session.user.email},key:process.env.RAZORPAY_KEY_ID },{status:200});
    } catch (error:any) {
        return NextResponse.json({ message: "Failed to create order", error },{status:500});
    }

}