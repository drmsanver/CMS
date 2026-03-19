import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'K-12 Counseling & Guidance Platform',
  description: 'Multi-tenant web-based counseling and guidance management platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <main className="animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
