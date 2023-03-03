/*
  Warnings:

  - You are about to drop the column `contryId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `deliveryContryId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_contryId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "contryId",
ADD COLUMN     "deliveryContryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryContryId_fkey" FOREIGN KEY ("deliveryContryId") REFERENCES "Contry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
