/*
  Warnings:

  - The primary key for the `UserBookCar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,carId]` on the table `UserBookCar` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `UserBookCar` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "UserBookCar" DROP CONSTRAINT "UserBookCar_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "UserBookCar_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserBookCar_userId_carId_key" ON "UserBookCar"("userId", "carId");
