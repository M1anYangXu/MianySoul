-- CreateTable
CREATE TABLE "ArticleCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT '📁',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ArticleTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#1890ff',
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ArticleTagRelation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleTagRelation_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArticleTagRelation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ArticleTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "categoryId" TEXT,
    "coverImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "authorId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ArticleCategory_name_idx" ON "ArticleCategory"("name");

-- CreateIndex
CREATE INDEX "ArticleCategory_sortOrder_idx" ON "ArticleCategory"("sortOrder");

-- CreateIndex
CREATE INDEX "ArticleCategory_isActive_idx" ON "ArticleCategory"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleTag_name_key" ON "ArticleTag"("name");

-- CreateIndex
CREATE INDEX "ArticleTag_name_idx" ON "ArticleTag"("name");

-- CreateIndex
CREATE INDEX "ArticleTagRelation_articleId_idx" ON "ArticleTagRelation"("articleId");

-- CreateIndex
CREATE INDEX "ArticleTagRelation_tagId_idx" ON "ArticleTagRelation"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleTagRelation_articleId_tagId_key" ON "ArticleTagRelation"("articleId", "tagId");

-- CreateIndex
CREATE INDEX "Article_title_idx" ON "Article"("title");

-- CreateIndex
CREATE INDEX "Article_status_idx" ON "Article"("status");

-- CreateIndex
CREATE INDEX "Article_categoryId_idx" ON "Article"("categoryId");

-- CreateIndex
CREATE INDEX "Article_authorId_idx" ON "Article"("authorId");

-- CreateIndex
CREATE INDEX "Article_createdAt_idx" ON "Article"("createdAt");
