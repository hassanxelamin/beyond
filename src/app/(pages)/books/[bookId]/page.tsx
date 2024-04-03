import React from 'react';
import prisma from '@/lib/prisma';
import ePub from 'epubjs';

async function Books({ params }: { params: any }) {
  const bookId = parseInt(params.bookId, 10);

  try {
    const book = await prisma.file.findUnique({
      where: {
        id: bookId,
      },
    });
    if (book) {
      if (book.contentUrl) {
        const books = ePub(book.contentUrl);
        return books;
      }
      // Handle the case when book.contentUrl is null
    }
  } catch (error) {
    console.error(error);
  }
  return <div className="flex flex-col">Books</div>;
}

export default Books;
