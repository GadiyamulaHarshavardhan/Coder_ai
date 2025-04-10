// app/auth/ProtectedRoute.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, removeToken } from './authService';

type AuthType = 'login' | 'register' | 'protected';

interface ProtectedRouteProps {
  children: React.ReactNode;
  authType?: AuthType;
  redirectPath?: string;
  loadingComponent?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  authType = 'protected',
  redirectPath = '/protected/chat',
  loadingComponent = <DefaultLoading />
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const token = getToken();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Handle unauthenticated access to protected routes
        if (!token && authType === 'protected') {
          router.push('/auth/login');
          return;
        }

        // Handle authenticated access to auth routes (both login and register)
        if (token && (authType === 'login' || authType === 'register')) {
          router.push(redirectPath);
          return;
        }

        // Verify token for protected routes
        if (token && authType === 'protected') {
          const isValid = await verifyToken(token);
          if (!isValid) {
            removeToken();
            router.push('/auth/login');
            return;
          }
        }

        setIsVerified(true);
      } catch (error) {
        console.error('Auth verification error:', error);
        removeToken();
        router.push('/auth/login');
      }
    };

    verifyAuth();
  }, [authType, token, router, pathname, redirectPath]);

  if (isVerified === null) {
    return <>{loadingComponent}</>;
  }

  return <>{children}</>;
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8000/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

function DefaultLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Verifying authentication...</p>
      </div>
    </div>
  );
}