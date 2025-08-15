// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 認証不要なパス
const publicPaths = ['/login', '/signup', '/api/config']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 環境変数が設定されているかチェック
  const isConfigured = process.env.USER_POOL_ID && 
                       process.env.CLIENT_ID && 
                       process.env.AWS_REGION

  if (!isConfigured && !pathname.startsWith('/api/')) {
    console.error('AWS Cognito環境変数が設定されていません')
  }

  // 公開パスの場合は処理をスキップ
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // 静的ファイルやAPIルートは除外
  const isStaticOrApi = pathname.startsWith('/_next') || 
                        pathname.startsWith('/api/') ||
                        pathname.includes('.')

  if (isPublicPath || isStaticOrApi) {
    const response = NextResponse.next()
    
    // APIエンドポイントのセキュリティヘッダー
    if (pathname.startsWith('/api/config')) {
      response.headers.set('Cache-Control', 'no-store, max-age=0')
    }
    
    return response
  }

  // Cognitoのトークンをチェック
  const idToken = request.cookies.get('CognitoIdentityServiceProvider.' + process.env.CLIENT_ID + '.LastAuthUser')
  const accessToken = request.cookies.get('CognitoIdentityServiceProvider.' + process.env.CLIENT_ID + '.' + idToken?.value + '.idToken')

  // トークンが存在しない場合はログインページへリダイレクト
  if (!idToken || !accessToken) {
    const loginUrl = new URL('/login', request.url)
    // リダイレクト後に元のページに戻れるように
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // 認証済みユーザーがログイン/サインアップページにアクセスした場合はホームへリダイレクト
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}