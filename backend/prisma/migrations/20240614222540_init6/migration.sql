-- DropForeignKey
ALTER TABLE "FileChunk" DROP CONSTRAINT "FileChunk_fileId_fkey";

-- AddForeignKey
ALTER TABLE "FileChunk" ADD CONSTRAINT "FileChunk_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
