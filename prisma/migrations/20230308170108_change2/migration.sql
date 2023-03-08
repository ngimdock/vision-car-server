-- AlterTable
ALTER TABLE "EmailVerification" ALTER COLUMN "token" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PasswordReset" ALTER COLUMN "token" SET DATA TYPE TEXT;
