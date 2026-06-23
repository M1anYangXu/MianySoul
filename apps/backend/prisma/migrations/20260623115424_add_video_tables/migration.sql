-- CreateTable
CREATE TABLE "VideoGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT '📁',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "size" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "duration" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Video_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "VideoGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "VideoGroup_userId_idx" ON "VideoGroup"("userId");

-- CreateIndex
CREATE INDEX "VideoGroup_isDefault_idx" ON "VideoGroup"("isDefault");

-- CreateIndex
CREATE INDEX "VideoGroup_sortOrder_idx" ON "VideoGroup"("sortOrder");

-- CreateIndex
CREATE INDEX "Video_userId_idx" ON "Video"("userId");

-- CreateIndex
CREATE INDEX "Video_groupId_idx" ON "Video"("groupId");
