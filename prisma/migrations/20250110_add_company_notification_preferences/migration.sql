
-- CreateTable
CREATE TABLE "company_notification_preferences" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "newForYouEmail" BOOLEAN NOT NULL DEFAULT true,
    "newForYouBrowser" BOOLEAN NOT NULL DEFAULT true,
    "newForYouApp" BOOLEAN NOT NULL DEFAULT true,
    "accountActivityEmail" BOOLEAN NOT NULL DEFAULT true,
    "accountActivityBrowser" BOOLEAN NOT NULL DEFAULT true,
    "accountActivityApp" BOOLEAN NOT NULL DEFAULT true,
    "newBrowserEmail" BOOLEAN NOT NULL DEFAULT true,
    "newBrowserBrowser" BOOLEAN NOT NULL DEFAULT true,
    "newBrowserApp" BOOLEAN NOT NULL DEFAULT false,
    "newDeviceEmail" BOOLEAN NOT NULL DEFAULT true,
    "newDeviceBrowser" BOOLEAN NOT NULL DEFAULT false,
    "newDeviceApp" BOOLEAN NOT NULL DEFAULT false,
    "notificationFrequency" TEXT NOT NULL DEFAULT 'online',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_notification_preferences_companyId_key" ON "company_notification_preferences"("companyId");

-- AddForeignKey
ALTER TABLE "company_notification_preferences" ADD CONSTRAINT "company_notification_preferences_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
