// src/app/api/auth/session/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  
  const idToken = cookieStore.get('idToken')
  const accessToken = cookieStore.get('accessToken')
  
  if (!idToken || !accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  
  // JWTからusername等を抽出（簡易実装）
  try {
    const payload = JSON.parse(
      Buffer.from(idToken.value.split('.')[1], 'base64').toString()
    )
    
    return NextResponse.json({
      authenticated: true,
      username: payload['cognito:username'] || payload.username
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}