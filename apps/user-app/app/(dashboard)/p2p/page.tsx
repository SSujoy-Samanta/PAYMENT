import { SendCard } from "../../../components/SendCard";


export default async function RazorPayDash () {
    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Peer To Peer Transaction
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <SendCard/>
        </div>
    </div>
}