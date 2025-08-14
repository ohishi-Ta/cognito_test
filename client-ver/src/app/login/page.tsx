// app/login/page.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js'
import Link from 'next/link'

// Cognito設定 - 実際の値に置き換えてください
const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID!
}

const userPool = new CognitoUserPool(poolData)

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    })

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool
    })

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: CognitoUserSession) => {
        // トークンをlocalStorageに保存
        localStorage.setItem('idToken', result.getIdToken().getJwtToken())
        localStorage.setItem('accessToken', result.getAccessToken().getJwtToken())
        localStorage.setItem('username', username)
        
        // TOPページへリダイレクト
        router.push('/')
      },
      onFailure: (err: Error) => {
        setError(err.message || 'ログインに失敗しました')
        setLoading(false)
      }
    })
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
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
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