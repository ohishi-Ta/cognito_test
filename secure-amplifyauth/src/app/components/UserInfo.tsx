// app/components/UserInfo.tsx
'use client'

import { useEffect, useState } from 'react'

export default function UserInfo() {
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          setUsername(data.username)
        }
      } catch {
        setUsername('')
      }
    }
    
    fetchUser()
  }, [])

  return (
    <p style={{ margin: '10px 0' }}>
      ログイン中のユーザー: <strong>{username || '読み込み中...'}</strong>
    </p>
  )
}