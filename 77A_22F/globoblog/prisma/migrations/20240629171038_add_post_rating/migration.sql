/*
  Warnings:

  - You are about to drop the column `downvotes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PostRatingType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- CreateTable
CREATE TABLE "PostRating" (
    "id" SERIAL NOT NULL,
    "ratingType" "PostRatingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "PostRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostRating" ADD CONSTRAINT "PostRating_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostRating" ADD CONSTRAINT "PostRating_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
