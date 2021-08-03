/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meaning` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Spelling` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Example" DROP CONSTRAINT "Example_wordId_fkey";

-- DropForeignKey
ALTER TABLE "Meaning" DROP CONSTRAINT "Meaning_wordId_fkey";

-- DropForeignKey
ALTER TABLE "Spelling" DROP CONSTRAINT "Spelling_wordId_fkey";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "examples" TEXT[],
ADD COLUMN     "meanings" TEXT[],
ADD COLUMN     "spellings" TEXT[];

-- DropTable
DROP TABLE "Example";

-- DropTable
DROP TABLE "Meaning";

-- DropTable
DROP TABLE "Spelling";
