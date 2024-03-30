'use client';

import { EdgeStoreProvider } from '@/lib/edgestore';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <EdgeStoreProvider>{children}</EdgeStoreProvider>
    </>
  );
};
