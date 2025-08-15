// src/app/api/config/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // サーバーサイドで環境変数を読み取り、クライアントに渡す
  const config = {
    Auth: {
      Cognito: {
        userPoolId: process.env.USER_POOL_ID!,
        userPoolClientId: process.env.CLIENT_ID!,
        region: process.env.AWS_REGION!,
        signUpVerificationMethod: 'code' as const,
        loginWith: {
          username: true,
          email: false
        }
      }
    }
  }

  return NextResponse.json(config)
}