-- CreateTable
CREATE TABLE "__WordInterpretationUpvotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "__WordInterpretationDownvotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "__WordInterpretationUpvotes_AB_unique" ON "__WordInterpretationUpvotes"("A", "B");

-- CreateIndex
CREATE INDEX "__WordInterpretationUpvotes_B_index" ON "__WordInterpretationUpvotes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "__WordInterpretationDownvotes_AB_unique" ON "__WordInterpretationDownvotes"("A", "B");

-- CreateIndex
CREATE INDEX "__WordInterpretationDownvotes_B_index" ON "__WordInterpretationDownvotes"("B");

-- AddForeignKey
ALTER TABLE "__WordInterpretationUpvotes" ADD FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__WordInterpretationUpvotes" ADD FOREIGN KEY ("B") REFERENCES "WordInterpretation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__WordInterpretationDownvotes" ADD FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "__WordInterpretationDownvotes" ADD FOREIGN KEY ("B") REFERENCES "WordInterpretation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
