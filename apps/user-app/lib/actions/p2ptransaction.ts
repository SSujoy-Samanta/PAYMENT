import prisma from "@repo/db/client";


export async function P2PTransaction(amount:number,phoneno:string,from:number):Promise<boolean> {
    try {
        const toUser=await prisma.user.findUnique({
            where:{
                number:phoneno
            }
        })
       
        if(!toUser){
            return false;
        }
        await prisma.$transaction(async(tx)=>{

            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

            const fromBalance=await tx.balance.findUnique({
                where:{
                    userId:Number(from)
                }
            })
           
            if(!fromBalance || fromBalance.amount < amount){
                throw new Error('Insufficient funds');
            }
      
            await tx.balance.update({
                where:{
                    id:fromBalance.id
                },
                data:{
                    amount:{
                        decrement:amount
                    }
                }
            })
         
            await tx.balance.update({
                where:{
                    userId:toUser.id
                },
                data:{
                    amount:{
                        increment:amount
                    }
                }
            })
    
            await tx.p2pTransfer.create({
                data: {
                    fromUserId: Number(from),
                    toUserId: toUser.id,
                    amount,
                    timestamp: new Date()
                }
            })
        })
        return true;
        
    } catch (error:any) {
        console.log("Error Occured"+error);
        return false;
    }
    
    
}