import { AuthButton } from "./AuthButton"
import { Logo } from "./Logo"

export const AppBar=()=>{
    return <div className="w-full bg-fuchsia-800 p-2 flex justify-between items-center pr-20">
        <Logo/>  
        <AuthButton/>
    </div>
}