// ===================================
// app/components/LogoutButton.tsx
// クライアントコンポーネント - ログアウト機能のみ
// ===================================
'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'aws-amplify/auth'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      localStorage.removeItem('username')
      router.push('/login')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  return (
    <button 
      onClick={handleLogout}
      style={{
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      ログアウト
    </button>
  )
}