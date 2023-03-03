/*
  Warnings:

  - You are about to alter the column `number` on the `CreditCard` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "CreditCard" ALTER COLUMN "number" SET DATA TYPE INTEGER;
