// app/signup/page.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CognitoUserPool, 
  CognitoUserAttribute, 
  CognitoUser,
  ISignUpResult,
} from 'amazon-cognito-identity-js'

// Cognito設定
const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_CLIENT_ID!
}

const userPool = new CognitoUserPool(poolData)

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // パスワード確認
    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    // パスワードポリシーチェック（例：8文字以上）
    if (password.length < 8) {
      setError('パスワードは8文字以上で設定してください')
      return
    }

    setLoading(true)

    const attributeList: CognitoUserAttribute[] = []
    
    const emailAttribute = new CognitoUserAttribute({
      Name: 'email',
      Value: email
    })
    attributeList.push(emailAttribute)

    userPool.signUp(username, password, attributeList, [], (err: Error | undefined, result?: ISignUpResult) => {
      setLoading(false)
      
      if (err) {
        setError(err.message || 'サインアップに失敗しました')
        return
      }

      if (result) {
        console.log('サインアップ成功:', result.user)
        setIsVerifying(true)
        setError('')
      }
    })
  }

  const handleVerification = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool
    })
    
    cognitoUser.confirmRegistration(verificationCode, true, (err: Error | undefined, result?: string) => {
      setLoading(false)
      
      if (err) {
        setError(err.message || '確認コードが正しくありません')
        return
      }

      console.log('検証成功:', result)
      alert('アカウントが作成されました！ログインページに移動します。')
      router.push('/login')
    })
  }

  if (isVerifying) {
    return (
      <div style={{ padding: '2rem', maxWidth: '400px', margin: '100px auto' }}>
        <h1 style={{ marginBottom: '30px' }}>メール確認</h1>
        
        <p style={{ marginBottom: '20px', color: '#666' }}>
          {email} に確認コードを送信しました。
        </p>

        <form onSubmit={handleVerification}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              確認コード
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              disabled={loading}
              placeholder="6桁のコード"
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
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? '確認中...' : '確認'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '100px auto' }}>
      <h1 style={{ marginBottom: '30px' }}>新規登録</h1>
      
      <form onSubmit={handleSignup}>
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
            placeholder="半角英数字"
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
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="8文字以上"
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
            パスワード（確認）
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            backgroundColor: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        >
          {loading ? '登録中...' : '登録'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <Link 
            href="/login"
            style={{ 
              color: '#007bff', 
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            すでにアカウントをお持ちの方はこちら
          </Link>
        </div>
      </form>
    </div>
  )
}