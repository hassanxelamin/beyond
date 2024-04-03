-- AlterTable
ALTER TABLE "File" ADD COLUMN     "contentUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
