/*
  Warnings:

  - Added the required column `wordId` to the `WordInterpretation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WordInterpretation" ADD COLUMN     "wordId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "WordInterpretation" ADD FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
