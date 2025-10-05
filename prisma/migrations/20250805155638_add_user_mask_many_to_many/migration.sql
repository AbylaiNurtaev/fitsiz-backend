/*
  Warnings:

  - You are about to drop the column `mask_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_mask_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mask_id";

-- CreateTable
CREATE TABLE "UserMask" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "maskId" INTEGER NOT NULL,

    CONSTRAINT "UserMask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMask_userId_maskId_key" ON "UserMask"("userId", "maskId");

-- AddForeignKey
ALTER TABLE "UserMask" ADD CONSTRAINT "UserMask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMask" ADD CONSTRAINT "UserMask_maskId_fkey" FOREIGN KEY ("maskId") REFERENCES "Mask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
