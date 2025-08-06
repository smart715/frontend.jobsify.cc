
-- CreateTable
CREATE TABLE "SecuritySettings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "emailTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "googleAuthEnabled" BOOLEAN NOT NULL DEFAULT false,
    "recaptchaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "recaptchaSiteKey" TEXT,
    "recaptchaSecretKey" TEXT,
    "smtpConfigured" BOOLEAN NOT NULL DEFAULT false,
    "passwordPolicy" JSONB DEFAULT '{"minLength": 8, "requireUppercase": true, "requireLowercase": true, "requireNumbers": true, "requireSpecialChars": true}',
    "sessionTimeout" INTEGER DEFAULT 30,
    "maxLoginAttempts" INTEGER DEFAULT 5,
    "lockoutDuration" INTEGER DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecuritySettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecuritySettings_companyId_key" ON "SecuritySettings"("companyId");

-- AddForeignKey
ALTER TABLE "SecuritySettings" ADD CONSTRAINT "SecuritySettings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
