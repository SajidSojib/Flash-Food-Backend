/*
  Warnings:

  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the `meal_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "meal_categories" DROP CONSTRAINT "meal_categories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "meal_categories" DROP CONSTRAINT "meal_categories_mealId_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "image";

-- DropTable
DROP TABLE "meal_categories";

-- CreateTable
CREATE TABLE "_CategoryToMeal" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToMeal_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToMeal_B_index" ON "_CategoryToMeal"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToMeal" ADD CONSTRAINT "_CategoryToMeal_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToMeal" ADD CONSTRAINT "_CategoryToMeal_B_fkey" FOREIGN KEY ("B") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
