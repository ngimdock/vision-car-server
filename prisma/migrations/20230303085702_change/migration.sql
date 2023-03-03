/*
  Warnings:

  - Changed the type of `number` on the `CreditCard` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "number",
ADD COLUMN     "number" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_number_key" ON "CreditCard"("number");
