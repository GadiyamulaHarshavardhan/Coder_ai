// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Correct common typos
  if (path.startsWith('/protectd/')) {
    return NextResponse.redirect(
      new URL(path.replace('/protectd/', '/protected/'), request.url)
    );
  }

  // Normal route protection
  const token = request.cookies.get('authToken')?.value;
  if (path.startsWith('/protected/') && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}