/*
  Warnings:

  - You are about to drop the column `iSAproved` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "iSAproved",
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;
