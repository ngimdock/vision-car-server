/*
  Warnings:

  - You are about to drop the `_LikedCars` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LikedCars" DROP CONSTRAINT "_LikedCars_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikedCars" DROP CONSTRAINT "_LikedCars_B_fkey";

-- DropTable
DROP TABLE "_LikedCars";

-- CreateTable
CREATE TABLE "_savedCars" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_savedCars_AB_unique" ON "_savedCars"("A", "B");

-- CreateIndex
CREATE INDEX "_savedCars_B_index" ON "_savedCars"("B");

-- AddForeignKey
ALTER TABLE "_savedCars" ADD CONSTRAINT "_savedCars_A_fkey" FOREIGN KEY ("A") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedCars" ADD CONSTRAINT "_savedCars_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
