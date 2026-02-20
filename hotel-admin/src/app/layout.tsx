import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"
import NavigationWrapper from '@/components/NavigationWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LuxeHotel - Cloud Property Management',
  description: 'A modern, robust property management system for premium hotels.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-50 text-zinc-900 antialiased selection:bg-indigo-500/30`}>
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
        <Analytics />
      </body>
    </html>
  );
}
