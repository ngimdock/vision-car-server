-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_publisherId_fkey";

-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "publisherId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
