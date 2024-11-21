import { Card } from "./Card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map((t:any,ind:number) => <div 
                className={`flex justify-between p-4 ${
                    t.status.toLowerCase() === "success"
                    ? "bg-green-600"
                    : t.status.toLowerCase() === "failure"
                    ? "bg-red-600"
                    : "bg-yellow-700"
                } mb-2 rounded-md`}
                key={ind}
            >
                <div>
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                    <div className="flex flex-col justify-center">
                        {t.status}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>
                

            </div>)}
        </div>
    </Card>
}