-- AlterTable
ALTER TABLE "CatalogItem" ADD COLUMN     "maskId" INTEGER;

-- CreateTable
CREATE TABLE "UserAdmin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAdmin_username_key" ON "UserAdmin"("username");

-- AddForeignKey
ALTER TABLE "CatalogItem" ADD CONSTRAINT "CatalogItem_maskId_fkey" FOREIGN KEY ("maskId") REFERENCES "Mask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
