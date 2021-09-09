/*
  Warnings:

  - A unique constraint covering the columns `[swissGerman,dialect]` on the table `Word` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Word_swissGerman_dialect_key" ON "Word"("swissGerman", "dialect");
