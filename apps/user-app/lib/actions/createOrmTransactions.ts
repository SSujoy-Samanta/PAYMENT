"use server"
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../auth/auth";
import prisma from "@repo/db/client";

export interface TransactionResult {
    message: string;
    type: boolean;
}

export async function CreateOrmTransactions(provider: string, amount: number): Promise<TransactionResult> {
    try {
        const session = await getServerSession(NEXT_AUTH);

        // Check if the user is authenticated
        if (!session?.user || !session.user?.id) {
            return {
                message: "Unauthenticated request",
                type: false,
            };
        }

        // Generate a random token
        const token = (Math.random() * 1000).toString(6); // Ensures a consistent format

        // Create a new on-ramp transaction
        await prisma.onRampTransaction.create({
            data: {
                provider,
                status: "Processing",
                startTime: new Date(),
                token: token,
                userId: Number(session.user.id),
                amount: amount * 100, // Assuming amount is in a smaller denomination
            },
        });

        return {
            message: "Transaction created successfully",
            type: true,
        };
    } catch (error) {
        console.error("Error creating transaction:", error);

        return {
            message: error instanceof Error ? error.message : "Unknown error",
            type: false,
        };
    }
}
