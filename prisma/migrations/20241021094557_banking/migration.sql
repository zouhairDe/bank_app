/*
  Warnings:

  - You are about to drop the column `isBlocker` on the `creditCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "creditCard" DROP COLUMN "isBlocker",
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "number" SET DATA TYPE TEXT,
ALTER COLUMN "cvv" SET DATA TYPE TEXT;
