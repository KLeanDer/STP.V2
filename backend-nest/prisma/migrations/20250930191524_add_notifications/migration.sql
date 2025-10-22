/*
  Warnings:

  - A unique constraint covering the columns `[buyerId,sellerId,listingId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_buyerId_sellerId_listingId_key" ON "Chat"("buyerId", "sellerId", "listingId");
