-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_publisherId_fkey";

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
