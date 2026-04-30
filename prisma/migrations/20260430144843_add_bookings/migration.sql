-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "optIn" BOOLEAN NOT NULL DEFAULT false,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "subtotalCents" INTEGER NOT NULL,
    "feesCents" INTEGER NOT NULL,
    "lineItems" TEXT NOT NULL,
    "tierQty" JSONB NOT NULL,
    "sessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'succeeded',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_paymentIntentId_key" ON "bookings"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_referenceCode_key" ON "bookings"("referenceCode");

-- CreateIndex
CREATE INDEX "bookings_customerEmail_idx" ON "bookings"("customerEmail");

-- CreateIndex
CREATE INDEX "bookings_sessionId_idx" ON "bookings"("sessionId");

-- CreateIndex
CREATE INDEX "bookings_createdAt_idx" ON "bookings"("createdAt");
