/*
  Warnings:

  - You are about to drop the column `category` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttributeDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SubcategoryAttribute" (
    "subcategoryId" TEXT NOT NULL,
    "attributeDefinitionId" TEXT NOT NULL,
    "order" INTEGER,

    PRIMARY KEY ("subcategoryId", "attributeDefinitionId"),
    CONSTRAINT "SubcategoryAttribute_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubcategoryAttribute_attributeDefinitionId_fkey" FOREIGN KEY ("attributeDefinitionId") REFERENCES "AttributeDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListingAttributeValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "attributeDefinitionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ListingAttributeValue_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ListingAttributeValue_attributeDefinitionId_fkey" FOREIGN KEY ("attributeDefinitionId") REFERENCES "AttributeDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
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
    CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Listing_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("city", "condition", "contactName", "contactPhone", "createdAt", "deliveryAvailable", "description", "favorites", "id", "isOriginal", "isPromoted", "isVerified", "ordersCount", "price", "status", "title", "updatedAt", "userId", "views") SELECT "city", "condition", "contactName", "contactPhone", "createdAt", "deliveryAvailable", "description", "favorites", "id", "isOriginal", "isPromoted", "isVerified", "ordersCount", "price", "status", "title", "updatedAt", "userId", "views" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE INDEX "Listing_categoryId_idx" ON "Listing"("categoryId");
CREATE INDEX "Listing_subcategoryId_idx" ON "Listing"("subcategoryId");
CREATE INDEX "Listing_city_idx" ON "Listing"("city");
CREATE INDEX "Listing_createdAt_idx" ON "Listing"("createdAt");
CREATE INDEX "Listing_views_idx" ON "Listing"("views");
CREATE INDEX "Listing_isPromoted_idx" ON "Listing"("isPromoted");
CREATE INDEX "Listing_isVerified_idx" ON "Listing"("isVerified");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_slug_key" ON "Subcategory"("slug");

-- CreateIndex
CREATE INDEX "Subcategory_categoryId_idx" ON "Subcategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeDefinition_key_key" ON "AttributeDefinition"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ListingAttributeValue_listingId_attributeDefinitionId_key" ON "ListingAttributeValue"("listingId", "attributeDefinitionId");
