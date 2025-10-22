-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "condition" TEXT NOT NULL DEFAULT 'used',
    "city" TEXT,
    "isOriginal" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "deliveryAvailable" BOOLEAN NOT NULL DEFAULT false,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("category", "contactName", "contactPhone", "createdAt", "description", "favorites", "id", "ordersCount", "price", "status", "title", "updatedAt", "userId", "views") SELECT "category", "contactName", "contactPhone", "createdAt", "description", "favorites", "id", "ordersCount", "price", "status", "title", "updatedAt", "userId", "views" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE INDEX "Listing_category_idx" ON "Listing"("category");
CREATE INDEX "Listing_city_idx" ON "Listing"("city");
CREATE INDEX "Listing_createdAt_idx" ON "Listing"("createdAt");
CREATE INDEX "Listing_views_idx" ON "Listing"("views");
CREATE INDEX "Listing_isPromoted_idx" ON "Listing"("isPromoted");
CREATE INDEX "Listing_isVerified_idx" ON "Listing"("isVerified");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_listingId_key" ON "Favorite"("userId", "listingId");
