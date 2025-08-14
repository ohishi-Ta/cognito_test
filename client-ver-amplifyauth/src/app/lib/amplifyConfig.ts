// src/app/lib/amplifyConfig.ts
export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        username: true,
        email: false
      }
    }
  }
}