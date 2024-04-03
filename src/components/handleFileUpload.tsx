'use server';

import prisma from '@/lib/prisma';

interface SerializedFile {
  name: string;
  format: string;
  size: number;
  url: string;
}

export async function handleFileUpload(serializedFile: SerializedFile) {
  try {
    const fileData = await prisma.file.create({
      data: {
        name: serializedFile.name,
        format: serializedFile.format,
        size: serializedFile.size,
        contentUrl: serializedFile.url,
      },
    });

    return fileData;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
