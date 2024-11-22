"use client";

import { useState } from "react";
import { Card } from "./Card";
import { TextInput } from "./TextInput";
import axios from "axios";
import { useSession } from "next-auth/react";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const RazorpayCheckout = () => {
  const [value, setValue] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = useSession();

  const handlePayment = async () => {
    if (!session) {
      alert("Please log in to continue.");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create an order via backend
      const orderResponse = await axios.post("/api/v1/razorpay/createorder", {
        amount: Number(value),
      });

      const { id: orderId, notes, amount } = orderResponse.data.order;
      const { name, email } = orderResponse.data.details;
      const key = orderResponse.data.key;

      // Step 2: Initialize Razorpay options
      const options = {
        key: key, // Razorpay Key ID from backend
        amount: amount, // Amount in smallest currency unit
        currency: "INR",
        name: "SUPAY",
        description: `Transaction for User ${notes.userId}`,
        order_id: orderId, // Razorpay Order ID
        handler: async (response: RazorpayResponse) => {
          console.log("Payment successful!", response);

          try {
            // Step 3: Verify payment on backend
            const verifyResponse = await axios.post(
              "/api/v1/razorpay/verifypayment",
              {
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const result = verifyResponse.data;
            console.log(result);
            if (result.isOk) {
              alert("Payment successful!");
            } else {
              alert("Payment verification failed.");
            }
          } catch (verificationError:any) {
            console.error("Error verifying payment:", verificationError);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: name,
          email: email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Step 4: Open Razorpay checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error:any) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label="Amount"
          placeholder="Enter Amount"
          onChange={(val) => setValue(Number(val))}
        />
        <div className="flex justify-center pt-4">
          <button
            onClick={handlePayment}
            disabled={isProcessing || value <= 0}
            className={`p-2 px-3 rounded-md text-white ${
              isProcessing || value <= 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 cursor-pointer"
            }`}
          >
            {isProcessing ? "Processing..." : "Razor-Pay"}
          </button>
        </div>
      </div>
    </Card>
  );
};
