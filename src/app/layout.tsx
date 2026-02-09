import type { Metadata } from 'next';
import './globals.css';
import { roboto } from '@/lib/fonts';

export const metadata: Metadata = {
  title: {
    template: '%s | SMRT',
    default: 'SMRT',
  },
  description:
    'SMRT is your smart destination for electronics, computers, and tech essentials. Shop top brands, great prices, fast US shipping, and worldwide delivery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>{children}</body>
    </html>
  );
}
