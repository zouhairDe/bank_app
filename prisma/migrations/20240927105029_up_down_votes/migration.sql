/*
  Warnings:

  - The `upvotes` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `downvotes` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `votes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_postId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "upvotes",
ADD COLUMN     "upvotes" TEXT[],
DROP COLUMN "downvotes",
ADD COLUMN     "downvotes" TEXT[];

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "downVotes" TEXT[],
ADD COLUMN     "upVotes" TEXT[];

-- DropTable
DROP TABLE "votes";
