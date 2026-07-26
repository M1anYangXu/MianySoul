-- AlterTable
ALTER TABLE "MusicCategory" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "MusicCategory_isPublic_idx" ON "MusicCategory"("isPublic");