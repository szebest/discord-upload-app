/*
  Warnings:

  - Added the required column `size` to the `FileChunk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileChunk" ADD COLUMN     "size" INTEGER NOT NULL;
