/*
  Warnings:

  - You are about to drop the column `attachmentId` on the `FileChunk` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "FileChunk_attachmentId_key";

-- AlterTable
ALTER TABLE "FileChunk" DROP COLUMN "attachmentId";
