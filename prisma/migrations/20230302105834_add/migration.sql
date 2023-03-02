/*
  Warnings:

  - You are about to drop the `_CarToOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CarToOrder" DROP CONSTRAINT "_CarToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_CarToOrder" DROP CONSTRAINT "_CarToOrder_B_fkey";

-- AlterTable
ALTER TABLE "UserBookCar" ADD COLUMN     "orderId" TEXT;

-- DropTable
DROP TABLE "_CarToOrder";

-- AddForeignKey
ALTER TABLE "UserBookCar" ADD CONSTRAINT "UserBookCar_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
