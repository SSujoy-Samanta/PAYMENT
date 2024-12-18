import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()
const hashpass = async (password: string): Promise<string> => {
    const saltRounds = 10;  // Number of salt rounds, you can adjust based on your needs
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };
  async function main() {
    const alice = await prisma.user.upsert({
      where: { number: '9999999999' },
      update: {},
      create: {
        email: "alice@gmail.com",
        number: '9999999999',
        password: await hashpass('alice123'),
        name: 'alice',
        balance: {
          create: {
            amount: 0,
            locked: 0,
          },
        },
        OnRampTransaction: {
          create: [
            {
              startTime: new Date(),
              status: "Success",
              amount: 20000,
              token: "122",
              provider: "HDFC Bank",
            },
          ],
        },
      },
    });
    const aliceBalance = await prisma.balance.create({
      data: {
          userId: alice.id, // Use the ID of the already-created user
          amount: 0,
          locked: 0,
      },
    })
  
    const bob = await prisma.user.upsert({
      where: { number: '9999999998' },
      update: {},
      create: {
        email: "bob@gmail.com",
        number: '9999999998',
        password: await hashpass('bob123'),
        name: 'bob',
        balance: {
          create: {
            amount: 0,
            locked: 0,
          },
        },
        OnRampTransaction: {
          create: [
            {
              startTime: new Date(),
              status: "Failure",
              amount: 2000,
              token: "123",
              provider: "HDFC Bank",
            },
          ],
        },
      },
    });
    const bobBalance = await prisma.balance.create({
      data: {
          userId: bob.id,
          amount: 0,
          locked: 0,
      },
    });
  
    console.log({ alice, bob });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    //@ts-ignore
    process.exit(1)
})