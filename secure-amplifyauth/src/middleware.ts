// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // 認証不要なパス（公開ページ）
  const publicPaths = [
    '/login',
    '/signup',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/config',
    '/api/auth/signin',
    '/api/auth/session'
  ]
  
  // 静的ファイルは除外
  if (
    pathname.includes('/_next') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg')
  ) {
    return NextResponse.next()
  }
  
  // 公開パスはそのまま通す
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // 認証チェック
  const idToken = request.cookies.get('idToken')
  const accessToken = request.cookies.get('accessToken')
  
  // トークンがない場合はログインページへリダイレクト
  if (!idToken || !accessToken) {
    // APIルートの場合は401を返す
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // ページアクセスの場合はログインページへリダイレクト
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname) // リダイレクト元を記録
    return NextResponse.redirect(loginUrl)
  }
  
  // トークンの有効期限チェック（オプション）
  try {
    const payload = JSON.parse(
      Buffer.from(idToken.value.split('.')[1], 'base64').toString()
    )
    
    const exp = payload.exp * 1000 // JWTのexpはUNIX秒なのでミリ秒に変換
    if (Date.now() > exp) {
      // トークンが期限切れ
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('idToken')
      response.cookies.delete('accessToken')
      return response
    }
  } catch (error) {
    // トークンのパースに失敗した場合もログインへ
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * - api/auth (認証関連API)
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico (ファビコン)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}