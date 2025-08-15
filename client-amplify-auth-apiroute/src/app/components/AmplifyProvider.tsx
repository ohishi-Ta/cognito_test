// src/app/components/AmplifyProvider.tsx
'use client'

import { Amplify } from 'aws-amplify'
import { useEffect, useState } from 'react'

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const configureAmplify = async () => {
      try {
        // API routeから設定を取得
        const response = await fetch('/api/config')
        const config = await response.json()
        
        Amplify.configure(config, { ssr: true })
        setIsConfigured(true)
      } catch (error) {
        console.error('Failed to configure Amplify:', error)
      }
    }

    configureAmplify()
  }, [])

  // 設定が完了するまでローディング表示
  if (!isConfigured) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}