import FileUploads from '@/components/FileUploads';
import { handleFileUpload } from '@/components/handleFileUpload';

export default function Home() {
  return (
    <main>
      <FileUploads handleFileUpload={handleFileUpload} />
    </main>
  );
}
