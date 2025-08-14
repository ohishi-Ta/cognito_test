// src/app/components/AmplifyProvider.tsx
'use client'

import { Amplify } from 'aws-amplify'
import { useEffect, useState } from 'react'

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const configureAmplify = async () => {
      try {
        // サーバーから設定を取得
        const response = await fetch('/api/auth/config')
        if (!response.ok) throw new Error('Failed to fetch config')
        
        const config = await response.json()
        
        // Amplifyを設定
        Amplify.configure({
          Auth: {
            Cognito: {
              userPoolId: config.userPoolId,
              userPoolClientId: config.userPoolClientId,
              signUpVerificationMethod: 'code' as const,
              loginWith: {
                username: true,
                email: false
              }
            }
          }
        }, { ssr: true })
        
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