import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { ThemeProvider } from "./components/theme-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Real-Time Chat',
  description: 'A real-time chat application built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}