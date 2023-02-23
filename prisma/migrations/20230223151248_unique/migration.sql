/*
  Warnings:

  - A unique constraint covering the columns `[brand]` on the table `Car` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Car_brand_key" ON "Car"("brand");
