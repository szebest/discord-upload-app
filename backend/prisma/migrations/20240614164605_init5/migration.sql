-- DropIndex
DROP INDEX "FileChunk_messageId_key";

-- AlterTable
ALTER TABLE "FileChunk" ADD CONSTRAINT "FileChunk_pkey" PRIMARY KEY ("messageId");
