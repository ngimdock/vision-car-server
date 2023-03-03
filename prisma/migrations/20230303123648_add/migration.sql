-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "contryId" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_contryId_fkey" FOREIGN KEY ("contryId") REFERENCES "Contry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
