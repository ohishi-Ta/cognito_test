// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CognitoUserPool } from 'amazon-cognito-identity-js'

// Cognito設定 - login/page.jsと同じ値を使用
const poolData = {
  UserPoolId: 'ap-northeast-1_fKzqYUlPT',
  ClientId: '343cj4j8ea4s5bnel4ns9mp26f'
}

const userPool = new CognitoUserPool(poolData)

export default function HomePage() {
  const router = useRouter()
  const [username, setUsername] = useState<string>('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // 認証チェック
    const checkAuth = () => {
      const idToken = localStorage.getItem('idToken')
      const storedUsername = localStorage.getItem('username')
      
      if (!idToken) {
        // 未認証の場合はログインページへ
        router.push('/login')
        return
      }
      
      setUsername(storedUsername || '')
      setIsAuthenticated(true)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    // Cognitoからサインアウト
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
    }
    
    // localStorageをクリア
    localStorage.removeItem('idToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('username')
    
    // ログインページへリダイレクト
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>読み込み中...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1 style={{ margin: 0 }}>TOPページ</h1>
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
      </header>

      <main>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ marginTop: 0 }}>ようこそ！</h2>
          <p style={{ margin: '10px 0' }}>
            ログイン中のユーザー: <strong>{username}</strong>
          </p>
        </div>

        <div style={{ 
          padding: '20px',
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px'
        }}>
          <h3>コンテンツエリア</h3>
          <p>ここにメインコンテンツが表示されます。</p>
        </div>
      </main>
    </div>
  )
}