'use server';
import axios from "axios";

export const createRazorpayOrder = async (userId: string, amount: number) => {
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    const authHeader = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

    try {
        const response = await axios.post(
            "https://api.razorpay.com/v1/orders",
            {
                amount: amount * 100, // Convert to smallest currency unit (e.g., paise for INR)
                currency: "INR",
                receipt: `user_${userId}`, // Custom identifier for the transaction
                notes: { userId },
            },
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response.data);
        return response.data; 

    } catch (error) {
        console.error("Error creating Razorpay order.");
        return null;
    }
};