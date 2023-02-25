/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Contry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Contry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `CreditCard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Car_brand_idx" ON "Car"("brand");

-- CreateIndex
CREATE UNIQUE INDEX "Contry_name_key" ON "Contry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Contry_code_key" ON "Contry"("code");

-- CreateIndex
CREATE INDEX "Contry_name_idx" ON "Contry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_number_key" ON "CreditCard"("number");
