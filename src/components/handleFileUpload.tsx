'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface SerializedFile {
  name: string;
  format: string;
  size: number;
  url: string;
}

export async function handleFileUpload(serializedFile: SerializedFile) {
  try {
    console.log('trying to upload file');
    // Fetch the content of the file from the URL
    const response = await fetch(serializedFile.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch the file from ${serializedFile.url}`);
    }
    const contentBuffer = await response.arrayBuffer(); // Get the file content as ArrayBuffer

    const fileData = await prisma.file.create({
      data: {
        name: serializedFile.name,
        format: serializedFile.format,
        size: serializedFile.size,
        content: Buffer.from(contentBuffer),
      },
    });

    return fileData;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
