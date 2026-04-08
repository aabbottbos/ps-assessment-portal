-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientDescription" TEXT,
    "assessmentType" TEXT NOT NULL,
    "assessmentUrl" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "passwordRequired" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_slug_key" ON "Assessment"("slug");

-- CreateIndex
CREATE INDEX "Assessment_slug_idx" ON "Assessment"("slug");

-- CreateIndex
CREATE INDEX "Assessment_status_idx" ON "Assessment"("status");

-- CreateIndex
CREATE INDEX "AccessLog_assessmentId_idx" ON "AccessLog"("assessmentId");

-- CreateIndex
CREATE INDEX "AccessLog_accessedAt_idx" ON "AccessLog"("accessedAt");

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
