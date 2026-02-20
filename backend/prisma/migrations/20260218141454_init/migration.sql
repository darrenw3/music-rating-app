-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "review" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_trackId_key" ON "Review"("userId", "trackId");
