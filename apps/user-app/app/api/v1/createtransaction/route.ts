import { NextRequest, NextResponse } from "next/server";
import { CreateOrmTransactions} from "../../../../lib/actions/createOrmTransactions";


export async function POST(req: NextRequest) {
    try {
        // Parse the request JSON body
        const { provider, value }: { provider: string; value: number } = await req.json();
        if (!provider || !value || typeof value !== "number") {
            return NextResponse.json(
                { msg: "Invalid inputs" },
                { status: 400 }
            );
        }
        const response=await CreateOrmTransactions(provider, value);
        if(response.type===false){
            return NextResponse.json({msg:response.message},{status:401});
        }
        return NextResponse.json({ message: "Transaction Initiation Successful" },{status:200});
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
