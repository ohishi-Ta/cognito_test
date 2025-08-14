// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  
  // Cookieを削除
  cookieStore.delete('idToken')
  cookieStore.delete('accessToken')
  
  return NextResponse.json({ success: true })
}