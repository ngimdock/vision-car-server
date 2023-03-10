/*
  Warnings:

  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PasswordReset";

-- CreateTable
CREATE TABLE "PasswordForgoten" (
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordForgoten_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordForgoten_token_key" ON "PasswordForgoten"("token");
