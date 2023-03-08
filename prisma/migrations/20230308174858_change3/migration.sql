-- AlterTable
ALTER TABLE "EmailVerification" ALTER COLUMN "time" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PasswordReset" ALTER COLUMN "time" DROP DEFAULT;
