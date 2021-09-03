-- CreateEnum
CREATE TYPE "Dialect" AS ENUM ('BASEL', 'AARGAU', 'BERN', 'LUZERN', 'OSTSCHWEIZ', 'SOLOTHURN', 'ZUERICH', 'GLARUS', 'FREIBURG', 'URI', 'WALLIS', 'OTHER');

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "swissGerman" TEXT NOT NULL,
    "german" TEXT NOT NULL,
    "spellings" TEXT[],
    "dialect" "Dialect" NOT NULL,
    "audioSamplePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interpretation" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meaning" (
    "id" SERIAL NOT NULL,
    "interpretationId" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "examples" TEXT[],

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "preferredDialect" "Dialect" NOT NULL DEFAULT E'OTHER',
    "password" TEXT NOT NULL,
    "lastForgotPasswordAt" TIMESTAMP(3),
    "lastPasswordResetAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "_InterpretationUpvotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_InterpretationDownvotes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Word.swissGerman_unique" ON "Word"("swissGerman");

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_InterpretationUpvotes_AB_unique" ON "_InterpretationUpvotes"("A", "B");

-- CreateIndex
CREATE INDEX "_InterpretationUpvotes_B_index" ON "_InterpretationUpvotes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InterpretationDownvotes_AB_unique" ON "_InterpretationDownvotes"("A", "B");

-- CreateIndex
CREATE INDEX "_InterpretationDownvotes_B_index" ON "_InterpretationDownvotes"("B");

-- AddForeignKey
ALTER TABLE "Word" ADD FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interpretation" ADD FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interpretation" ADD FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meaning" ADD FOREIGN KEY ("interpretationId") REFERENCES "Interpretation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterpretationUpvotes" ADD FOREIGN KEY ("A") REFERENCES "Interpretation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterpretationUpvotes" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterpretationDownvotes" ADD FOREIGN KEY ("A") REFERENCES "Interpretation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterpretationDownvotes" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
