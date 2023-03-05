/*
  Warnings:

  - You are about to drop the `Chipper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChipperToContry` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SHIPPER';

-- DropForeignKey
ALTER TABLE "_ChipperToContry" DROP CONSTRAINT "_ChipperToContry_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChipperToContry" DROP CONSTRAINT "_ChipperToContry_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shipperId" TEXT;

-- DropTable
DROP TABLE "Chipper";

-- DropTable
DROP TABLE "_ChipperToContry";

-- CreateTable
CREATE TABLE "UserShipToContry" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "contryId" TEXT NOT NULL,

    CONSTRAINT "UserShipToContry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserShipToContry_userId_contryId_key" ON "UserShipToContry"("userId", "contryId");

-- AddForeignKey
ALTER TABLE "UserShipToContry" ADD CONSTRAINT "UserShipToContry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserShipToContry" ADD CONSTRAINT "UserShipToContry_contryId_fkey" FOREIGN KEY ("contryId") REFERENCES "Contry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
