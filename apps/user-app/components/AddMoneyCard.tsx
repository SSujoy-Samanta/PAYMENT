"use client";

import { useState } from "react";
import { Card } from "./Card";
import { TextInput } from "./TextInput";
import { Select } from "./Select";
import axios from "axios";

const SUPPORTED_BANKS = [
    {
        name: "HDFC Bank",
        redirectUrl: "https://netbanking.hdfcbank.com",
    },
    {
        name: "Axis Bank",
        redirectUrl: "https://www.axisbank.com/",
    },
];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [value, setValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddMoney = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/v1/createtransaction", {
                provider,
                value: Number(value),
            });

            if (response?.status === 200 && response?.data?.message) {
                // Redirect if transaction initiation is successful
                window.location.href = redirectUrl || "";
            } else {
                alert(response?.data?.message || "An error occurred while processing the request.");
            }
        } catch (err) {
            console.error("Error during transaction initiation:", err);
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="Add Money">
            <div className="w-full">
                <TextInput
                    label="Amount"
                    placeholder="Amount"
                    onChange={(val) => {
                        setValue(Number(val));
                    }}
                />
                <div className="py-4 text-left">Bank</div>
                <Select
                    onSelect={(value) => {
                        const selectedBank = SUPPORTED_BANKS.find((x) => x.name === value);
                        setRedirectUrl(selectedBank?.redirectUrl || "");
                        setProvider(selectedBank?.name || "");
                    }}
                    options={SUPPORTED_BANKS.map((x) => ({
                        key: x.name,
                        value: x.name,
                    }))}
                />
                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleAddMoney}
                        disabled={isLoading || value <= 0}
                        className={`p-2 px-3 rounded-md text-white ${
                            isLoading || value <= 0
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600 cursor-pointer"
                        }`}
                    >
                        {isLoading ? "Processing..." : "Add Money"}
                    </button>
                </div>
            </div>
        </Card>
    );
};
