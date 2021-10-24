-- CreateEnum
CREATE TYPE "WordType" AS ENUM ('NOUN', 'VERB', 'ARTICLE', 'ADJECTIVE', 'PRONOUN', 'NUMERAL', 'PARTICLE');

-- CreateEnum
CREATE TYPE "WordGender" AS ENUM ('MASCULINE', 'FEMININE', 'NEUTER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "wordType" "WordType";

-- CreateTable
CREATE TABLE "Grammar" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "nounPlural" TEXT,
    "nounGender" "WordGender",
    "verbPresentId" INTEGER,
    "verbConditionalIId" INTEGER,
    "verbConditionalIIId" INTEGER,
    "verbParticiplePast" TEXT,
    "adjectiveComparative" TEXT,
    "adjectiveSuperlative" TEXT,

    CONSTRAINT "Grammar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerbConjucation" (
    "id" SERIAL NOT NULL,
    "firstPerson" TEXT,
    "secondPerson" TEXT,
    "thirdPerson" TEXT,
    "firstPersonPlural" TEXT,
    "secondPersonPlural" TEXT,
    "thirdPersonPlural" TEXT,

    CONSTRAINT "VerbConjucation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerbConjugationHistory" (
    "id" SERIAL NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "firstPerson" TEXT,
    "secondPerson" TEXT,
    "thirdPerson" TEXT,
    "firstPersonPlural" TEXT,
    "secondPersonPlural" TEXT,
    "thirdPersonPlural" TEXT,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerbConjugationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grammar_wordId_key" ON "Grammar"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "Grammar_verbPresentId_key" ON "Grammar"("verbPresentId");

-- CreateIndex
CREATE UNIQUE INDEX "Grammar_verbConditionalIId_key" ON "Grammar"("verbConditionalIId");

-- CreateIndex
CREATE UNIQUE INDEX "Grammar_verbConditionalIIId_key" ON "Grammar"("verbConditionalIIId");

-- AddForeignKey
ALTER TABLE "Grammar" ADD CONSTRAINT "Grammar_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grammar" ADD CONSTRAINT "Grammar_verbPresentId_fkey" FOREIGN KEY ("verbPresentId") REFERENCES "VerbConjucation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grammar" ADD CONSTRAINT "Grammar_verbConditionalIId_fkey" FOREIGN KEY ("verbConditionalIId") REFERENCES "VerbConjucation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grammar" ADD CONSTRAINT "Grammar_verbConditionalIIId_fkey" FOREIGN KEY ("verbConditionalIIId") REFERENCES "VerbConjucation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerbConjugationHistory" ADD CONSTRAINT "VerbConjugationHistory_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "VerbConjucation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerbConjugationHistory" ADD CONSTRAINT "VerbConjugationHistory_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CUSTOM Create Grammar Entity for each word
insert into "Grammar" ("wordId") select id from "Word";