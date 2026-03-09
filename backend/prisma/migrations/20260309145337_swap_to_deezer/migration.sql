/*
  Warnings:

  - You are about to drop the column `trackId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `deezerId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "deezerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "review" TEXT,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("createdAt", "id", "rating", "review", "userId") SELECT "createdAt", "id", "rating", "review", "userId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE UNIQUE INDEX "Review_userId_deezerId_type_key" ON "Review"("userId", "deezerId", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
