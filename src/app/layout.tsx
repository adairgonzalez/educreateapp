import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import '../styles/layout.css';
import '../styles/home-page.css';
import '../styles/login.css';
import '../styles/dashboard.css';
import '../styles/checkout.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'eduCreate - Interactive Learning Platform',
  description: 'Create engaging educational content with AI-powered tools',
  icons: {
    icon: '/favicon.ico', // Default favicon
    shortcut: '/favicon.ico', // Shortcut icon
    apple: '/apple-icon.png', // Apple touch icon
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={'dark'}>
      <head />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
