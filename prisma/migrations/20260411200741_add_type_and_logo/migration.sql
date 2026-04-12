-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'assessment';

-- CreateIndex
CREATE INDEX "Assessment_type_idx" ON "Assessment"("type");
