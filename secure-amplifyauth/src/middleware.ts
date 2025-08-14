// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // 認証不要なパス
  const publicPaths = ['/login', '/signup', '/api/auth/login', '/api/auth/logout']
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // APIルートの場合
  if (pathname.startsWith('/api/')) {
    const idToken = request.cookies.get('idToken')
    if (!idToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  // ページアクセスの場合
  const idToken = request.cookies.get('idToken')
  if (!idToken && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}