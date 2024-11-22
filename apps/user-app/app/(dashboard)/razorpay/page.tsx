import { RazorpayCheckout } from "../../../components/RazorpayCheckout";

export default async function RazorPayDash () {
    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Razor Pay
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <RazorpayCheckout/>
        </div>
    </div>
}