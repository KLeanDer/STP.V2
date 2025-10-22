-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("category", "contactName", "contactPhone", "createdAt", "description", "id", "price", "status", "title", "updatedAt", "userId", "views") SELECT "category", "contactName", "contactPhone", "createdAt", "description", "id", "price", "status", "title", "updatedAt", "userId", "views" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE INDEX "Listing_category_idx" ON "Listing"("category");
CREATE INDEX "Listing_createdAt_idx" ON "Listing"("createdAt");
CREATE INDEX "Listing_views_idx" ON "Listing"("views");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
