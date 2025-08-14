// ===================================
// app/components/LogoutButton.tsx
// クライアントコンポーネント - ログアウト機能のみ
// ===================================
'use client'

import { useRouter } from 'next/navigation'
import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'ap-northeast-1_fKzqYUlPT',
  ClientId: '343cj4j8ea4s5bnel4ns9mp26f'
}

const userPool = new CognitoUserPool(poolData)

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
    }
    
    localStorage.removeItem('idToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('username')
    
    router.push('/login')
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