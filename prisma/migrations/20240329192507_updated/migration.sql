/*
  Warnings:

  - You are about to drop the column `bookId` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_bookId_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "fileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "File" DROP COLUMN "bookId";

-- CreateIndex
CREATE UNIQUE INDEX "Book_fileId_key" ON "Book"("fileId");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
