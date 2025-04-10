// app/page.tsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from './auth/authService';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    router.push(token ? '/auth/login'  : '/protectd/chat');
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h1 className="text-xl font-bold text-gray-800">Loading Application</h1>
        </div>
      </div>
    </div>
  );
}