/*
  Warnings:

  - You are about to drop the column `catalogId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `maskId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CatalogItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CatalogItem" DROP CONSTRAINT "CatalogItem_maskId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_catalogId_fkey";

-- AlterTable
ALTER TABLE "Mask" ADD COLUMN     "days" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "installment" TEXT,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "catalogId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "maskId",
ADD COLUMN     "mask_id" INTEGER;

-- DropTable
DROP TABLE "CatalogItem";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mask_id_fkey" FOREIGN KEY ("mask_id") REFERENCES "Mask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
