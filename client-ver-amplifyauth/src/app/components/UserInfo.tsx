// ===================================
// app/components/UserInfo.tsx
// クライアントコンポーネント - ユーザー情報表示
// ===================================
'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'

export default function UserInfo() {
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser()
        setUsername(user.username)
      } catch {
        // localStorageから取得（フォールバック）
        const storedUsername = localStorage.getItem('username')
        setUsername(storedUsername || '')
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