import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { NEXT_AUTH } from "../../../../lib/auth/auth";
import { P2PTransaction } from "../../../../lib/actions/p2ptransaction";

export async function POST(req: NextRequest) {
    try {
        const { amount, phoneno }: { amount: number, phoneno: string } = await req.json();
        const session=await getServerSession(NEXT_AUTH);

        if (!session?.user || !session.user?.id) {
            return {
                message: "Unauthenticated request",
               status: "failed"
            };
        }
        if (!amount || !phoneno) {
            return NextResponse.json({ message: "Invalid Inputs", status: "failed" }, { status: 400 });
        }

        const phoneNumberRegex = /^[0-9]{10}$/;
        if (!phoneNumberRegex.test(phoneno)) {
            return NextResponse.json({ message: "Invalid phone number format" ,status: "failed"}, { status: 400 });
        }

        // Proceed with your logic (e.g., saving data to the database or processing the payment)
        // Example: Simulating a successful payment or operation.
        const result=await P2PTransaction(amount*100,phoneno,session.user.id);

        if(!result){
            return NextResponse.json({ message: "Payment Falied.", status: "failed" }, { status: 411 });
        }

        return NextResponse.json({
            message: "Transaction successful",
            status: "success",
            amount,
            phoneno,
        }, { status: 200 });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ message: "Internal Server Error", status: "failed" }, { status: 500 });
    }
}
