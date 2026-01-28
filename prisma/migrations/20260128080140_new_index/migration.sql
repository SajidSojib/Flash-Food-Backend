-- CreateIndex
CREATE INDEX "meals_providerId_categoryId_isAvailable_idx" ON "meals"("providerId", "categoryId", "isAvailable");

-- CreateIndex
CREATE INDEX "order-items_orderId_mealId_idx" ON "order-items"("orderId", "mealId");

-- CreateIndex
CREATE INDEX "orders_userId_status_idx" ON "orders"("userId", "status");

-- CreateIndex
CREATE INDEX "providers_userId_idx" ON "providers"("userId");

-- CreateIndex
CREATE INDEX "reviews_userId_mealId_rating_idx" ON "reviews"("userId", "mealId", "rating");

-- AlterTable
ALTER TABLE reviews
ADD CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5);
