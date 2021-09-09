-- DropForeignKey
ALTER TABLE "Interpretation" DROP CONSTRAINT "Interpretation_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Interpretation" DROP CONSTRAINT "Interpretation_wordId_fkey";

-- DropForeignKey
ALTER TABLE "Meaning" DROP CONSTRAINT "Meaning_interpretationId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_createdByUserId_fkey";

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interpretation" ADD CONSTRAINT "Interpretation_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interpretation" ADD CONSTRAINT "Interpretation_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meaning" ADD CONSTRAINT "Meaning_interpretationId_fkey" FOREIGN KEY ("interpretationId") REFERENCES "Interpretation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "User.username_unique" RENAME TO "User_username_key";
