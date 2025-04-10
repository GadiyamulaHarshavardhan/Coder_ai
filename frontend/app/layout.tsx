// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import { ThemeProvider } from "./protected/chat/components/theme-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Real-Time Chat',
  description: 'A real-time chat application built with Next.js',
};

// Client-side component for error handling
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  if (typeof window !== 'undefined') {
    const { ErrorBoundary } = require('react-error-boundary');
    const Fallback = ({ error }: { error: Error }) => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Application Error</h2>
          <p className="mb-4 dark:text-gray-300">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
    return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
  }
  return <>{children}</>;
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
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}