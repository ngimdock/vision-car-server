/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `date` on the `Order` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('SUBMITED', 'VALIDATED', 'DELIVERED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'SUBMITED';
COMMIT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "date",
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "submitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "validatedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'SUBMITED';
