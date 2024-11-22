"use client"
import { useState } from "react";
import { Center } from "./Center";
import { Card } from "./Card";
import { TextInput } from "./TextInput";
import axios from "axios";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
   
    const handleSendPayment = async () => {
    
        setIsProcessing(true);
    
        try {
            const response=await axios.post('/api/v1/p2p',{
                amount:Number(amount),
                phoneno:number,
            })
            if (response.data.status = "success") {
                alert("Payment successfull.");
            }else{
                alert("Payment Failed.");
            }
          
        } catch (error:any) {
          console.error("Error initiating payment:", error);
          alert("Failed to initiate payment. Please try again.");
        } finally {
          setIsProcessing(false);
        }
    };
    return <div className="h-[90vh]">
        <Center>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Number" name="mobile no" onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        <button
                            onClick={handleSendPayment}
                            disabled={isProcessing || Number(amount) <= 0}
                            className={`p-2 px-3 rounded-md text-white ${
                            isProcessing || Number(amount) <= 0
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600 cursor-pointer"
                            }`}
                        >
                            {isProcessing ? "Processing..." : "Send"}
                        </button>
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}