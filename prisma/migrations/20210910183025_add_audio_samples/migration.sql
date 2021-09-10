/*
  Warnings:

  - You are about to drop the column `audioSamplePath` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "audioSamplePath";

-- CreateTable
CREATE TABLE "AudioSample" (
    "id" TEXT NOT NULL,
    "wordId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioSample_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AudioSample" ADD CONSTRAINT "AudioSample_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioSample" ADD CONSTRAINT "AudioSample_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
