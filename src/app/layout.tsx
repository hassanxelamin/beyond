import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/lib/providers';
import './globals.css';
import xhr2 from 'xhr2';

global.XMLHttpRequest = xhr2;

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beyond AI',
  description: 'See beyond the page!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
