// src/app/lib/amplifyServerConfig.ts
// サーバーサイドのみで使用する設定（環境変数にNEXT_PUBLIC_不要）

export const amplifyServerConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.USER_POOL_ID!,
      userPoolClientId: process.env.CLIENT_ID!,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        username: true,
        email: false
      }
    }
  }
}

// 環境変数の検証
export function validateEnvVars() {
  if (!process.env.USER_POOL_ID || !process.env.CLIENT_ID) {
    throw new Error('Missing required environment variables: USER_POOL_ID, CLIENT_ID')
  }
}