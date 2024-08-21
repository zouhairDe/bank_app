-- AlterTable
ALTER TABLE "user" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'email',
ALTER COLUMN "userId" DROP NOT NULL;
