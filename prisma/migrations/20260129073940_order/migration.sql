/*
  Warnings:

  - You are about to drop the column `userId` on the `meals` table. All the data in the column will be lost.
  - Added the required column `providerId` to the `meals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_userId_fkey";

-- DropIndex
DROP INDEX "meals_userId_isAvailable_idx";

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "userId",
ADD COLUMN     "providerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "providerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "meals_providerId_isAvailable_idx" ON "meals"("providerId", "isAvailable");

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
