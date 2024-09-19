-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "iSAproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
