/*
  Warnings:

  - You are about to drop the column `points` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "points";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;
