/*
  Warnings:

  - You are about to drop the column `categoryId` on the `meals` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_categoryId_fkey";

-- DropIndex
DROP INDEX "meals_providerId_categoryId_isAvailable_idx";

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "meal_categories" (
    "mealId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "meal_categories_pkey" PRIMARY KEY ("mealId","categoryId")
);

-- CreateIndex
CREATE INDEX "meals_providerId_isAvailable_idx" ON "meals"("providerId", "isAvailable");

-- AddForeignKey
ALTER TABLE "meal_categories" ADD CONSTRAINT "meal_categories_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_categories" ADD CONSTRAINT "meal_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
