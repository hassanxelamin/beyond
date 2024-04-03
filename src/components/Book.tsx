import React from 'react';
import prisma from '@/lib/prisma';

export default async function Book() {
  try {
    const allBooks = await prisma.file.findMany();
    return allBooks;
  } catch (error) {
    console.error(error);
  }

  return <div>Book</div>;
}
