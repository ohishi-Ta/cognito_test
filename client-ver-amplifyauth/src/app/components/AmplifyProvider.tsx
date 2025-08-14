// src/app/components/AmplifyProvider.tsx
'use client'

import { Amplify } from 'aws-amplify'
import { amplifyConfig } from '../lib/amplifyConfig'
import { useEffect } from 'react'

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Amplify.configure(amplifyConfig, { ssr: true })
  }, [])

  return <>{children}</>
}