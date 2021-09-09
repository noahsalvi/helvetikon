-- DropForeignKey
ALTER TABLE "Interpretation" DROP CONSTRAINT "Interpretation_wordId_fkey";

-- DropForeignKey
ALTER TABLE "Meaning" DROP CONSTRAINT "Meaning_interpretationId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AddForeignKey
ALTER TABLE "Interpretation" ADD CONSTRAINT "Interpretation_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meaning" ADD CONSTRAINT "Meaning_interpretationId_fkey" FOREIGN KEY ("interpretationId") REFERENCES "Interpretation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
