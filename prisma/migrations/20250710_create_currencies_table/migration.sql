
-- CreateTable
CREATE TABLE "currencies" (
    "id" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "symbol" VARCHAR(191) NOT NULL,
    "code" VARCHAR(191) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "format" VARCHAR(191) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- Insert default currencies
INSERT INTO "currencies" ("id", "name", "symbol", "code", "rate", "format", "isDefault", "createdAt", "updatedAt") VALUES
('default_usd', 'US Dollar', '$', 'USD', 1, '$1,000.00', true, NOW(), NOW()),
('default_eur', 'Euro', '€', 'EUR', 1, '€1,000.00', false, NOW(), NOW()),
('default_gbp', 'British Pound', '£', 'GBP', 1, '£1,000.00', false, NOW(), NOW()),
('default_inr', 'Indian Rupee', '₹', 'INR', 1, '₹1,000.00', false, NOW(), NOW());
