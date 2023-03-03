/*
  Warnings:

  - A unique constraint covering the columns `[userId,carId,bookedAt]` on the table `UserBookCar` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserBookCar_userId_carId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserBookCar_userId_carId_bookedAt_key" ON "UserBookCar"("userId", "carId", "bookedAt");
