/*
  Warnings:

  - You are about to drop the column `examples` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `meanings` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the `WordHistory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[swissGerman]` on the table `Word` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdByUserId` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WordHistory" DROP CONSTRAINT "WordHistory_updatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "WordHistory" DROP CONSTRAINT "WordHistory_wordId_fkey";

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "examples",
DROP COLUMN "meanings",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdByUserId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "WordHistory";

-- CreateTable
CREATE TABLE "WordInterpretation" (
    "id" SERIAL NOT NULL,
    "meaning" TEXT NOT NULL,
    "examples" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word.swissGerman_unique" ON "Word"("swissGerman");

-- AddForeignKey
ALTER TABLE "Word" ADD FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordInterpretation" ADD FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
