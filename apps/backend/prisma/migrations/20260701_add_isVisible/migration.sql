-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ImageGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT '📁',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ImageGroup" ("createdAt", "deletedAt", "description", "icon", "id", "isDefault", "name", "sortOrder", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "description", "icon", "id", "isDefault", "name", "sortOrder", "updatedAt", "userId" FROM "ImageGroup";
DROP TABLE "ImageGroup";
ALTER TABLE "new_ImageGroup" RENAME TO "ImageGroup";
CREATE INDEX "ImageGroup_userId_idx" ON "ImageGroup"("userId");
CREATE INDEX "ImageGroup_isDefault_idx" ON "ImageGroup"("isDefault");
CREATE INDEX "ImageGroup_isVisible_idx" ON "ImageGroup"("isVisible");
CREATE INDEX "ImageGroup_sortOrder_idx" ON "ImageGroup"("sortOrder");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

