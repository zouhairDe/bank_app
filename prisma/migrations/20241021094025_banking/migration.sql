/*
  Warnings:

  - You are about to drop the column `city` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `downVotes` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `upVotes` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- DropIndex
DROP INDEX "user_userId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "downVotes",
DROP COLUMN "upVotes",
DROP COLUMN "userId",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "posts";

-- CreateTable
CREATE TABLE "creditCard" (
    "ownerId" TEXT NOT NULL,
    "holder" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "cvv" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "isBlocker" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creditCard_pkey" PRIMARY KEY ("ownerId")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creditCard_ownerId_key" ON "creditCard"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "creditCard_number_key" ON "creditCard"("number");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");

-- AddForeignKey
ALTER TABLE "creditCard" ADD CONSTRAINT "creditCard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
