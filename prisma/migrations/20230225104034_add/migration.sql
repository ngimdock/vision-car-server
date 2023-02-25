-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('IN_PROGRESS', 'VALIDATED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('IMMATRICULATION', 'CERTIFICATE', 'PURCHASE_FORM');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('TOTAL_PAY', 'CREDIT_PAY');

-- CreateEnum
CREATE TYPE "PaymentRange" AS ENUM ('X2', 'X3', 'X5');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OrderStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "paymentType" "PaymentType" NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id" TEXT NOT NULL,
    "paymentRange" "PaymentRange" NOT NULL,
    "remainToPay" INTEGER NOT NULL,
    "limitDate" TIMESTAMP(3),
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chipper" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chipper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "note" TEXT,
    "file" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CarToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChipperToContry" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderDetail_orderId_key" ON "OrderDetail"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Chipper_name_key" ON "Chipper"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Chipper_code_key" ON "Chipper"("code");

-- CreateIndex
CREATE INDEX "Chipper_name_idx" ON "Chipper"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Document_file_key" ON "Document"("file");

-- CreateIndex
CREATE UNIQUE INDEX "_CarToOrder_AB_unique" ON "_CarToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_CarToOrder_B_index" ON "_CarToOrder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChipperToContry_AB_unique" ON "_ChipperToContry"("A", "B");

-- CreateIndex
CREATE INDEX "_ChipperToContry_B_index" ON "_ChipperToContry"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarToOrder" ADD CONSTRAINT "_CarToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarToOrder" ADD CONSTRAINT "_CarToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChipperToContry" ADD CONSTRAINT "_ChipperToContry_A_fkey" FOREIGN KEY ("A") REFERENCES "Chipper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChipperToContry" ADD CONSTRAINT "_ChipperToContry_B_fkey" FOREIGN KEY ("B") REFERENCES "Contry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
