-- AlterTable
ALTER TABLE "CatalogItem" ADD COLUMN     "days" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "installment" TEXT,
ADD COLUMN     "price" TEXT,
ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "Mask" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "power" TEXT,
ADD COLUMN     "price" TEXT,
ADD COLUMN     "sensors" INTEGER,
ADD COLUMN     "shadeRange" TEXT,
ADD COLUMN     "viewArea" TEXT,
ADD COLUMN     "weight" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT;

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maskId" INTEGER NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maskId" INTEGER,
    "catalogId" INTEGER,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_maskId_fkey" FOREIGN KEY ("maskId") REFERENCES "Mask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_maskId_fkey" FOREIGN KEY ("maskId") REFERENCES "Mask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "CatalogItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
