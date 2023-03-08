/*
  Warnings:

  - Changed the type of `token` on the `EmailVerification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `token` on the `PasswordReset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "EmailVerification" DROP COLUMN "token",
ADD COLUMN     "token" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PasswordReset" DROP COLUMN "token",
ADD COLUMN     "token" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerification_token_key" ON "EmailVerification"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");
