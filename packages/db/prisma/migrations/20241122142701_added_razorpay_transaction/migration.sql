/*
  Warnings:

  - Changed the type of `status` on the `OnRampTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Success', 'Failure', 'Processing');

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL;

-- DropEnum
DROP TYPE "OnRampStatus";

-- CreateTable
CREATE TABLE "RazorpayTransaction" (
    "id" SERIAL NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT,
    "signature" TEXT,
    "amount" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RazorpayTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RazorpayTransaction_orderId_key" ON "RazorpayTransaction"("orderId");

-- CreateIndex
CREATE INDEX "RazorpayTransaction_userId_idx" ON "RazorpayTransaction"("userId");

-- AddForeignKey
ALTER TABLE "RazorpayTransaction" ADD CONSTRAINT "RazorpayTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
