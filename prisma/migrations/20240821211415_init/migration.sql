/*
  Warnings:

  - Added the required column `image` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
