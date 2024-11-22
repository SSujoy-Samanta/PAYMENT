import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@repo/db/client";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET as string;

    const sig = crypto
        .createHmac("sha256", keySecret)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");
    return sig;
};

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const { orderId, razorpayPaymentId, razorpaySignature }=await req.json();

        // Check if all required fields are present
        if (!orderId || !razorpayPaymentId || !razorpaySignature) {
            return NextResponse.json(
                { message: "Missing required parameters", isOk: false },
                { status: 400 }
            );
        }

        // Generate the signature to compare
        const signature = generatedSignature(orderId, razorpayPaymentId);

        // Verify the signature
        if (signature !== razorpaySignature) {
            return NextResponse.json(
                { message: "Payment verification failed", isOk: false },
                { status: 400 }
            );
        }

        // If the signature is correct, proceed to update the database
        // Example: Update order or premium status in the database here
        // const transaction = await prisma.transaction.update({ ... });

        await prisma.razorpayTransaction.updateMany({
            where:{
                orderId:orderId,
            },
            data:{
                status:"Success",
                signature: razorpaySignature,
                paymentId:razorpayPaymentId,
                completedAt:new Date()

            }
        })

        return NextResponse.json(
            { message: "Payment verified successfully", isOk: true },
            { status: 200 }
        );
    } catch (error:any) {
        console.error("Error during payment verification:", error);
        return NextResponse.json(
            { message: "Internal server error", isOk: false },
            { status: 500 }
        );
    }
}
