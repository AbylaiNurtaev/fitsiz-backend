-- CreateTable
CREATE TABLE "ExtraField" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "maskId" INTEGER NOT NULL,

    CONSTRAINT "ExtraField_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExtraField" ADD CONSTRAINT "ExtraField_maskId_fkey" FOREIGN KEY ("maskId") REFERENCES "Mask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
