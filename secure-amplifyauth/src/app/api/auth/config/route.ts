// src/app/api/auth/config/route.ts
import { NextResponse } from 'next/server'

// クライアントに必要な設定のみを返す
export async function GET() {
  // 環境変数はサーバー側でのみアクセス
  const config = {
    userPoolId: process.env.USER_POOL_ID!,
    userPoolClientId: process.env.CLIENT_ID!,
    region: process.env.AWS_REGION || 'ap-northeast-1'
  }
  
  // 設定が不完全な場合はエラー
  if (!config.userPoolId || !config.userPoolClientId) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }
  
  return NextResponse.json(config)
}