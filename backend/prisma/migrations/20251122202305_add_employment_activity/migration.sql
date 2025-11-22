-- CreateTable
CREATE TABLE "EmploymentActivity" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "employerName" TEXT NOT NULL,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "activityDate" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "verificationMethod" TEXT,
    "provider" TEXT,
    "externalVerificationId" TEXT,
    "verificationUrl" TEXT,
    "verificationData" JSONB,
    "webhookReceivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmploymentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmploymentActivity_tenantId_idx" ON "EmploymentActivity"("tenantId");

-- CreateIndex
CREATE INDEX "EmploymentActivity_beneficiaryId_idx" ON "EmploymentActivity"("beneficiaryId");

-- CreateIndex
CREATE INDEX "EmploymentActivity_tenantId_verificationStatus_idx" ON "EmploymentActivity"("tenantId", "verificationStatus");

-- AddForeignKey
ALTER TABLE "EmploymentActivity" ADD CONSTRAINT "EmploymentActivity_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentActivity" ADD CONSTRAINT "EmploymentActivity_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
