-- CreateTable
CREATE TABLE "votes" (
    "id" SERIAL NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "voteType" TEXT NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "votes_postId_userId_voteType_key" ON "votes"("postId", "userId", "voteType");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
