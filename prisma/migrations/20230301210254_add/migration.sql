/*
  Warnings:

  - You are about to drop the `_BookedCars` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookedCars" DROP CONSTRAINT "_BookedCars_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookedCars" DROP CONSTRAINT "_BookedCars_B_fkey";

-- DropTable
DROP TABLE "_BookedCars";

-- CreateTable
CREATE TABLE "UserBookCar" (
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,

    CONSTRAINT "UserBookCar_pkey" PRIMARY KEY ("userId","carId")
);

-- AddForeignKey
ALTER TABLE "UserBookCar" ADD CONSTRAINT "UserBookCar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookCar" ADD CONSTRAINT "UserBookCar_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
