/*
  Warnings:

  - You are about to drop the `creditCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "creditCard" DROP CONSTRAINT "creditCard_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- DropTable
DROP TABLE "creditCard";

-- DropTable
DROP TABLE "transactions";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "phoneNumber" TEXT,
    "image" TEXT,
    "location" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "holder" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_number_key" ON "CreditCard"("number");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
