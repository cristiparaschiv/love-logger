-- CreateTable
CREATE TABLE "push_subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "relationship_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" DATETIME,
    "created_by_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "wishlist_items_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_endpoint_key" ON "push_subscriptions"("endpoint");

-- CreateIndex
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "wishlist_items_created_by_id_idx" ON "wishlist_items"("created_by_id");
