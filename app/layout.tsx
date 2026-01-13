import type { Metadata } from 'next';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'NebulaBoard X - Collaborative Infinite Whiteboard',
  description: 'Real-time collaborative infinite whiteboard with smart connectors and live features.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#0a0a1a" />
      </head>
      <body className="antialiased bg-slate-950 text-slate-100">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
