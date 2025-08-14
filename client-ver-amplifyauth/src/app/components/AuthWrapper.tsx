// app/components/AuthWrapper.tsx
// クライアントコンポーネント - 認証チェックのみ担当
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from 'aws-amplify/auth'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser()
      } catch {
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router])

  return <>{children}</>
}