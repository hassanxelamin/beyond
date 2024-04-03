import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';

async function Books() {
  let allBooks: any[] = []; // Declare the allBooks variable
  try {
    allBooks = await prisma.file.findMany(); // Assign the value inside the try block
  } catch (error) {
    console.error(error);
  }
  return (
    <div className="flex flex-col">
      <div>Books</div>
      {allBooks.map((book: any) => (
        <Link key={book.id} href={`books/${book.id}`}>
          <div>{book.name}</div>
        </Link>
      ))}
    </div>
  );
}

export default Books;
