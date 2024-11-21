import prisma from "@repo/db/client";
import express from "express";
import dotenv from "dotenv";
import { bankhookSchema } from "@repo/common/zodSchema";

dotenv.config();

const app = express();

app.use(express.json())

app.post("/hdfcwebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them

    try {
        const validPaymentInfo = bankhookSchema.safeParse({
            token: req.body.token,
            userId: req.body.userId,
            amount: req.body.amount,
            secret: req.body.secret,
        });

        if (!validPaymentInfo.success) {
            console.error("Invalid Inputs:", validPaymentInfo.error);
            res.status(400).json({
                message: "Invalid input",
                errors: validPaymentInfo.error.errors,
            });
            return;
        }

        // Extract the validated payment information
        const paymentInformation = {
            token: validPaymentInfo.data.token,
            userId: validPaymentInfo.data.userId,
            amount: validPaymentInfo.data.amount,
            secret:validPaymentInfo.data.secret,
        };

        if(paymentInformation.secret!=process.env.HDFC_SECRECT){
            res.status(401).json({
                message:"Authentication Failed"
            })
            return;
        }
        
        console.log("Payment information processed:", paymentInformation);

        await prisma.$transaction([
            prisma.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                    
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            prisma.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.status(200).json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003, () => {
    console.log("Server is running on port:3003");
});