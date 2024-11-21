import { LoadingSkeleton } from "../../../components/Loading/Loading1";


export default async function LoadingTransaction(){
    return <div className="h-full w-full">
        <LoadingSkeleton/>
    </div>
}