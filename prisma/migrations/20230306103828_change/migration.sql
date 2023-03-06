/*
  Warnings:

  - You are about to drop the column `shippedAd` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippedAd",
ADD COLUMN     "shippedAt" TIMESTAMP(3);
