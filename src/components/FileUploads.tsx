'use client';

import * as React from 'react';
import { useEdgeStore } from '../lib/edgestore';

interface SerializedFile {
  name: string;
  format: string;
  size: number;
  url: string;
}

interface FileUploadsProps {
  handleFileUpload: (file: SerializedFile) => Promise<any>;
}

export default function Page({ handleFileUpload }: FileUploadsProps) {
  const [file, setFile] = React.useState<File>();
  const { edgestore } = useEdgeStore();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) return;

    try {
      const res = await edgestore.publicFiles.upload({
        file,
      });

      const serializedFile = {
        name: file.name,
        format: file.type,
        size: file.size,
        url: res.url,
      };

      await handleFileUpload(serializedFile);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      <button type="submit">Upload Test Agin</button>
    </form>
  );
}
