/*
  Warnings:

  - Added the required column `quantity` to the `UserBookCar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBookCar" ADD COLUMN     "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "quantity" INTEGER NOT NULL;
