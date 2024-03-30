'use client';

import React from 'react';

import { EdgeStoreProvider } from '@/lib/edgestore';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <EdgeStoreProvider>{children}</EdgeStoreProvider>;
}
