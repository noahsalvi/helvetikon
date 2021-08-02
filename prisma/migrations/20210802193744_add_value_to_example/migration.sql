/*
  Warnings:

  - Added the required column `value` to the `Example` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Example" ADD COLUMN     "value" TEXT NOT NULL;
