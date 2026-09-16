ALTER TABLE "Payment" ADD COLUMN "gatewayTransactionId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "gatewayUrl" TEXT;
CREATE UNIQUE INDEX "Payment_gatewayTransactionId_key" ON "Payment"("gatewayTransactionId");
