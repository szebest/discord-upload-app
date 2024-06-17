/*
  Warnings:

  - A unique constraint covering the columns `[attachmentId]` on the table `FileChunk` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attachmentId` to the `FileChunk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileChunk" ADD COLUMN     "attachmentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FileChunk_attachmentId_key" ON "FileChunk"("attachmentId");
