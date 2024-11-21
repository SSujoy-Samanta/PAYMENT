'use client'

import { useRouter } from "next/navigation"

export const Logo=()=>{
    const router=useRouter();
    return <div className="flex gap-0.5 justify-center items-center text-3xl pl-20 cursor-pointer" onClick={()=>{
        router.push('/');
    }}>
        <p className="text-cyan-500 font-bold">Su</p>
        <p className="text-blue-700 font-bold">Pay</p>
    </div>
}