// app/login/page.tsx
'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Amplify } from 'aws-amplify'
import { signIn, fetchAuthSession } from 'aws-amplify/auth'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/' // リダイレクト元
  
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [isConfigured, setIsConfigured] = useState<boolean>(false)

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
        setError('設定の読み込みに失敗しました')
      }
    }
    
    configureAmplify()
  }, [])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // クライアントサイドでAmplify認証
      const { isSignedIn } = await signIn({ username, password })
      
      if (isSignedIn) {
        // トークンを取得
        const session = await fetchAuthSession()
        
        // API RouteでHTTPOnly Cookieにセット
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idToken: session.tokens?.idToken?.toString(),
            accessToken: session.tokens?.accessToken?.toString()
          })
        })
        
        if (!response.ok) throw new Error('Cookie設定に失敗しました')
        
        // localStorage から認証情報をクリア（Amplifyのデフォルト保存先）
        localStorage.clear()
        
        // 成功したら元のページまたはTOPページへ
        router.push(from)
      }
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました')
      setLoading(false)
    }
  }

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

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '100px auto' }}>
      <h1 style={{ marginBottom: '30px' }}>ログイン</h1>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            ユーザー名
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        {error && (
          <div style={{ 
            color: '#dc3545', 
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading || !isConfigured}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading || !isConfigured ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !isConfigured ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link 
          href="/signup"
          style={{ 
            color: '#28a745', 
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          新規アカウントを作成
        </Link>
      </div>
    </div>
  )
}