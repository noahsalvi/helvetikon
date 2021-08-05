/*
  Warnings:

  - You are about to drop the `__WordInterpretationDownvotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `__WordInterpretationUpvotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "__WordInterpretationDownvotes" DROP CONSTRAINT "__WordInterpretationDownvotes_A_fkey";

-- DropForeignKey
ALTER TABLE "__WordInterpretationDownvotes" DROP CONSTRAINT "__WordInterpretationDownvotes_B_fkey";

-- DropForeignKey
ALTER TABLE "__WordInterpretationUpvotes" DROP CONSTRAINT "__WordInterpretationUpvotes_A_fkey";

-- DropForeignKey
ALTER TABLE "__WordInterpretationUpvotes" DROP CONSTRAINT "__WordInterpretationUpvotes_B_fkey";

-- DropTable
DROP TABLE "__WordInterpretationDownvotes";

-- DropTable
DROP TABLE "__WordInterpretationUpvotes";

-- CreateTable
CREATE TABLE "_WordInterpretationUpvotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_WordInterpretationDownvotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WordInterpretationUpvotes_AB_unique" ON "_WordInterpretationUpvotes"("A", "B");

-- CreateIndex
CREATE INDEX "_WordInterpretationUpvotes_B_index" ON "_WordInterpretationUpvotes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WordInterpretationDownvotes_AB_unique" ON "_WordInterpretationDownvotes"("A", "B");

-- CreateIndex
CREATE INDEX "_WordInterpretationDownvotes_B_index" ON "_WordInterpretationDownvotes"("B");

-- AddForeignKey
ALTER TABLE "_WordInterpretationUpvotes" ADD FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordInterpretationUpvotes" ADD FOREIGN KEY ("B") REFERENCES "WordInterpretation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordInterpretationDownvotes" ADD FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordInterpretationDownvotes" ADD FOREIGN KEY ("B") REFERENCES "WordInterpretation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
