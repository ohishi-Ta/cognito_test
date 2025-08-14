// ===================================
// app/components/UserInfo.tsx
// クライアントコンポーネント - ユーザー情報表示
// ===================================
'use client'

import { useEffect, useState } from 'react'

export default function UserInfo() {
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    setUsername(storedUsername || '')
  }, [])

  return (
    <p style={{ margin: '10px 0' }}>
      ログイン中のユーザー: <strong>{username || '読み込み中...'}</strong>
    </p>
  )
}
