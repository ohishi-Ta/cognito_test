// app/components/AuthWrapper.tsx
// クライアントコンポーネント - 認証チェックのみ担当
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const idToken = localStorage.getItem('idToken')
    if (!idToken) {
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}