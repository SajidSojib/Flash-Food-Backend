/*
  Warnings:

  - You are about to drop the column `providerId` on the `meals` table. All the data in the column will be lost.
  - Added the required column `userId` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_providerId_fkey";

-- DropIndex
DROP INDEX "meals_providerId_isAvailable_idx";

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "providerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "meals_userId_isAvailable_idx" ON "meals"("userId", "isAvailable");

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
