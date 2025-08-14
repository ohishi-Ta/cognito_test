// app/components/AuthWrapper.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (!response.ok) {
          router.push('/login')
        }
      } catch {
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router])

  return <>{children}</>
}